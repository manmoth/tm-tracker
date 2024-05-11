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

    public async Task CreateGame(TrackedGame? game) {

        if(game is null)
            return;

        var gamesTableClient = CreateGameTableClient();
        await gamesTableClient.CreateIfNotExistsAsync();
        var gameRowKey = Guid.NewGuid().ToString();
        await gamesTableClient.AddEntityAsync(game with { PartitionKey = "games", RowKey = gameRowKey });
        var scoresTableClient = CreateGameScoresTableClient();
        await scoresTableClient.CreateIfNotExistsAsync();
        await scoresTableClient.AddEntityAsync(new GameScores {GameRowKey = gameRowKey} with { PartitionKey = "games", RowKey = Guid.NewGuid().ToString() });
    }

    public async Task<IEnumerable<Models.TrackedGame>> GetGames() {
        var tableClient = CreateGameTableClient();

        await tableClient.CreateIfNotExistsAsync();
        return tableClient.Query<TrackedGame>(g => g.PartitionKey == "games").ToList()
            .Select(mapper.Map<Models.TrackedGame>);
    }

    public async Task UpdateGame(Models.TrackedGame? game) {
        if(game is null)
            return;

        var id = Guid.TryParse(game.Id, out var guid) ? guid : Guid.Empty;

        if(id == Guid.Empty)
            return;

        var tableClient = CreateGameTableClient();
        var entity = tableClient.Query<TrackedGame>(g => g.PartitionKey == "games" && g.RowKey == id.ToString()).ToList().FirstOrDefault();

        if(entity is null)
            return;

        await tableClient.UpdateEntityAsync(entity with { EndedAt = entity.EndedAt is null && game.Ended ? DateTime.UtcNow : entity.EndedAt }, entity.ETag);
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