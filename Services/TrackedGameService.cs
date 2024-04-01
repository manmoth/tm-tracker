using System.Collections;
using Azure.Data.Tables;
using Azure.Identity;
using TmTracker.Models;

namespace TmTracker.Services;

public class TrackedGameService(TableServiceClient tableServiceClient, IHostEnvironment hostEnvironment)
{
    const string GamesTableName = "tmtrackergames";
    public static readonly IDictionary<int, string> Maps = new Dictionary<int, string> { 
        { 1, "Tharsis" }, 
        { 2, "Hellas" }, 
        { 3, "Elysium" }, 
        { 4, "Utopia Planitia" }, 
        { 5, "Terra Cimmeria" }, 
        { 6, "Vastitas Borealis" }, 
        { 7, "Amazonis Planitia" } 
    };

    private TableClient CreateTableClient() => tableServiceClient.GetTableClient(GamesTableName + hostEnvironment.EnvironmentName);

    public async Task CreateGame(TrackedGame? game) {

        if(game is null)
            return;

        var tableClient = CreateTableClient();
        await tableClient.CreateIfNotExistsAsync();
        await tableClient.AddEntityAsync(game with { PartitionKey = "games", RowKey = Guid.NewGuid().ToString() });
    }

    public async Task<IEnumerable<TrackedGame>> GetGames() {
        var tableClient = CreateTableClient();

        await tableClient.CreateIfNotExistsAsync();
        return tableClient.Query<TrackedGame>(filter: $"PartitionKey eq 'games'").ToList();
    }

    public async Task EndGame(TrackedGame? game) {
        if(game is null)
            return;

        var tableClient = CreateTableClient();

        await tableClient.UpdateEntityAsync(game with { EndedAt = DateTime.UtcNow }, game.ETag);
    }
}