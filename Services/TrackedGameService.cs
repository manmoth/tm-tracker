using System.Dynamic;
using Azure.Data.Tables;
using TmTracker.Models;

namespace TmTracker.Services;

public class TrackedGameService(TableServiceClient tableServiceClient, IHostEnvironment hostEnvironment)
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

    public async Task<IEnumerable<TrackedGame>> GetGames() {
        var tableClient = CreateGameTableClient();

        await tableClient.CreateIfNotExistsAsync();
        return tableClient.Query<TrackedGame>(g => g.PartitionKey == "games").ToList();
    }

    public async Task EndGame(TrackedGame? game) {
        if(game is null)
            return;

        var tableClient = CreateGameTableClient();

        await tableClient.UpdateEntityAsync(game with { EndedAt = DateTime.UtcNow }, game.ETag);
    }

    public async Task<IEnumerable<GameScores>> GetGameScores() {
        var tableClient = CreateGameScoresTableClient();

        await tableClient.CreateIfNotExistsAsync();
        return tableClient.Query<GameScores>(g => g.PartitionKey == "games").ToList();
    }

    public async Task SetGameScores(GameScores? gameScores) {
        if(gameScores is null)
            return;

        var tableClient = CreateGameScoresTableClient();
        await tableClient.UpdateEntityAsync(gameScores, gameScores.ETag);
    }
}