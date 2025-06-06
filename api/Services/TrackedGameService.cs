using Azure.Data.Tables;
using Mapster;
using MapsterMapper;
using TmTracker.Entities;

namespace TmTracker.Services;

public class TrackedGameService(TableServiceClient tableServiceClient, IHostEnvironment hostEnvironment, IMapper mapper)
{
    const string GamesTableName = "tmtrackergames";
    const string GameScoresTableName = "tmtrackergameScores";
    public static readonly IDictionary<int, string> Maps = new Dictionary<int, string> { 
        { 1, "Tharsis" }, 
        { 2, "Hellas" }, 
        { 3, "Elysium" }, 
        { 4, "Utopia Planitia" }, 
        { 5, "Terra Cimmeria" }, 
        { 6, "Vastitas Borealis" }, 
        { 7, "Amazonis Planitia" } 
    };

    private static readonly IDictionary<int, (DateTimeOffset Start, DateTimeOffset End)> SeasonDates = new Dictionary<int, (DateTimeOffset Start, DateTimeOffset End)> {
        { 1, (new (2024, 4, 1, 0, 0, 0, TimeSpan.Zero), new (2024, 8, 31, 0, 0, 0, TimeSpan.Zero)) },
        { 2, (new (2024, 9, 1, 0, 0, 0, TimeSpan.Zero), new (2025, 1, 1, 0, 0, 0, TimeSpan.Zero)) },
        { 3, (new (2025,1, 2, 0, 0, 0, TimeSpan.Zero), new (2025, 6, 1, 0, 0, 0, TimeSpan.Zero)) }
    };

    private static readonly DateTimeOffset CurrentSeasonStart = SeasonDates.Max(s => s.Value.End);

    private TableClient CreateGameTableClient() => tableServiceClient.GetTableClient(GamesTableName + hostEnvironment.EnvironmentName);
    private TableClient CreateGameScoresTableClient() => tableServiceClient.GetTableClient(GameScoresTableName + hostEnvironment.EnvironmentName);

    public async Task<Models.TrackedGame> CreateGame(Models.TrackedGame? game) {
        var gamesTableClient = CreateGameTableClient();
        await gamesTableClient.CreateIfNotExistsAsync();
        var gameRowKey = Guid.NewGuid().ToString();
        await gamesTableClient.AddEntityAsync(mapper.Map<TrackedGame>(game ?? new Models.TrackedGame()) with { PartitionKey = "games", RowKey = gameRowKey, StartedAt = DateTime.UtcNow });
        var scoresTableClient = CreateGameScoresTableClient();
        await scoresTableClient.CreateIfNotExistsAsync();
        await scoresTableClient.AddEntityAsync(new GameScores {GameRowKey = gameRowKey} with { PartitionKey = "games", RowKey = Guid.NewGuid().ToString() });

        var newGameEntity = (await gamesTableClient.GetEntityAsync<TrackedGame>("games", gameRowKey)).Value;
        var newGame = mapper.Map<Models.TrackedGame>(newGameEntity);
        return newGame;
    }

    public async Task<IEnumerable<Models.TrackedGame>> GetGames() {
        var tableClient = CreateGameTableClient();

        await tableClient.CreateIfNotExistsAsync();
        return tableClient.Query<TrackedGame>(g => g.PartitionKey == "games" && g.StartedAt > CurrentSeasonStart).ToList()
            .Select(mapper.Map<Models.TrackedGame>);
    }

    public async Task<IEnumerable<Models.TrackedGame>> GetGamesSeason(int season) {
        if(!SeasonDates.TryGetValue(season, out var seasonDates))
            return [];

        var tableClient = CreateGameTableClient();

        await tableClient.CreateIfNotExistsAsync();
        return tableClient.Query<TrackedGame>(g => g.PartitionKey == "games" && g.StartedAt < seasonDates.End && g.StartedAt > seasonDates.Start).ToList()
            .Select(mapper.Map<Models.TrackedGame>);
    }

    public async Task<Models.TrackedGame?> CreateOrUpdateGame(Models.TrackedGame? game) {

        Guid ParseId() => Guid.TryParse(game.Id, out var guid) ? guid : Guid.Empty;

        if(game is null)
            return null;

        if(ParseId() == Guid.Empty)
            game = await CreateGame(game);

        var id = ParseId();

        var tableClient = CreateGameTableClient();
        var entity = tableClient.Query<TrackedGame>(g => g.PartitionKey == "games" && g.RowKey == id.ToString()).ToList().FirstOrDefault();

        if(entity is null)
            return null;

        string? NullIfPlayerNotPresent(bool present, string? corpName) => present ? corpName : null;

        await tableClient.UpdateEntityAsync(entity with { 
            CorpGM = NullIfPlayerNotPresent(game.GM, game.CorpGM), CorpJV = NullIfPlayerNotPresent(game.JV, game.CorpJV), CorpH = NullIfPlayerNotPresent(game.H, game.CorpH), CorpT = NullIfPlayerNotPresent(game.T, game.CorpT), 
            TotalPausedMinutes = game.TotalPausedMinutes, Ended = game.Ended, EndedAt = entity.EndedAt is null && game.Ended ? DateTime.UtcNow : entity.EndedAt 
            }, entity.ETag
        );

        var gameEntity = (await tableClient.GetEntityAsync<TrackedGame>("games", entity.RowKey)).Value;
        return mapper.Map<Models.TrackedGame>(gameEntity);
    }

    public async Task<IEnumerable<Models.GameScores>> GetGameScores() {
        var tableGameClient = CreateGameTableClient();
        var tableGameScoresClient = CreateGameScoresTableClient();
        await tableGameClient.CreateIfNotExistsAsync();
        await tableGameScoresClient.CreateIfNotExistsAsync();

        var gamesThisSeason = tableGameClient.Query<TrackedGame>(g => g.PartitionKey == "games" && g.StartedAt > CurrentSeasonStart).ToList();
        var gameScores = tableGameScoresClient.Query<GameScores>(g => g.PartitionKey == "games").ToList();


        return gameScores.Where(gameScore => gamesThisSeason.Any(game => game.RowKey == gameScore.GameRowKey)).Select(mapper.Map<Models.GameScores>);
    }

    public async Task SetGameScores(Models.GameScores? gameScores) {
        if(gameScores is null)
            return;

        var gameId = Guid.TryParse(gameScores.GameId, out var guid) ? guid : Guid.Empty;

        if(gameId == Guid.Empty)
            return;

        var tableClient = CreateGameScoresTableClient();
        var entity = tableClient.Query<GameScores>(g => g.PartitionKey == "games" && g.GameRowKey == gameId.ToString()).ToList().FirstOrDefault();

        if(entity is null)
            return;

        await tableClient.UpdateEntityAsync(entity with { 
                H = gameScores.H, JV = gameScores.JV, GM = gameScores.GM, T = gameScores.T, 
                HWonTieBreaker = gameScores.HWonTieBreaker, JVWonTieBreaker = gameScores.JVWonTieBreaker,
                GMWonTieBreaker = gameScores.GMWonTieBreaker, TWonTieBreaker = gameScores.TWonTieBreaker
            }, entity.ETag);
    }

    public async Task<IEnumerable<Models.GameScores>> GetGameScoresSeason(int season)
    {
        if(!SeasonDates.TryGetValue(season, out var seasonDates))
            return [];

        var tableGameClient = CreateGameTableClient();
        var tableGameScoresClient = CreateGameScoresTableClient();
        await tableGameClient.CreateIfNotExistsAsync();
        await tableGameScoresClient.CreateIfNotExistsAsync();

        var gamesSeason = tableGameClient.Query<TrackedGame>(g => g.PartitionKey == "games" && g.StartedAt < seasonDates.End && g.StartedAt > seasonDates.Start).ToList();
        var gameScores = tableGameScoresClient.Query<GameScores>(g => g.PartitionKey == "games").ToList();

        return gameScores.Where(gameScore => gamesSeason.Any(game => game.RowKey == gameScore.GameRowKey)).Select(mapper.Map<Models.GameScores>);
    }
}