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
        return tableClient.Query<TrackedGame>(g => g.PartitionKey == "games").ToList()
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

        await tableClient.UpdateEntityAsync(entity with { TotalPausedMinutes = game.TotalPausedMinutes, Ended = game.Ended, EndedAt = entity.EndedAt is null && game.Ended ? DateTime.UtcNow : entity.EndedAt }, entity.ETag);

        var gameEntity = (await tableClient.GetEntityAsync<TrackedGame>("games", entity.RowKey)).Value;
        return mapper.Map<Models.TrackedGame>(gameEntity);
    }

    public async Task<IEnumerable<Models.GameScores>> GetGameScores() {
        var tableClient = CreateGameScoresTableClient();

        await tableClient.CreateIfNotExistsAsync();
        return tableClient.Query<GameScores>(g => g.PartitionKey == "games").ToList()
            .Select(mapper.Map<Models.GameScores>);
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

        await tableClient.UpdateEntityAsync(entity with { H = gameScores.H, JV = gameScores.JV, GM = gameScores.GM, T = gameScores.T }, entity.ETag);
    }
}