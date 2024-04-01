using System.Collections;
using Azure.Data.Tables;
using TmTracker.Models;

namespace TmTracker.Services;

public class TrackedGameService(IConfiguration configuration)
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

    public async Task CreateGame(TrackedGame? game) {

        if(game is null)
            return;

        var client = new TableClient(
            configuration.GetConnectionString("AzureTableStorage"),
            GamesTableName);

        await client.CreateIfNotExistsAsync();
        await client.AddEntityAsync(game with { PartitionKey = "games", RowKey = Guid.NewGuid().ToString() });
    }

    public async Task<IEnumerable<TrackedGame>> GetGames() {
        var client = new TableClient(
            configuration.GetConnectionString("AzureTableStorage"),
            GamesTableName);

        await client.CreateIfNotExistsAsync();
        return client.Query<TrackedGame>(filter: $"PartitionKey eq 'games'").ToList();
    }

    public async Task EndGame(TrackedGame? game) {
        if(game is null)
            return;

        var client = new TableClient(
            configuration.GetConnectionString("AzureTableStorage"),
            GamesTableName);

        await client.UpdateEntityAsync(game with { EndedAt = DateTime.UtcNow }, game.ETag);
    }
}