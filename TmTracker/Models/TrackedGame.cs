using Azure;
using Azure.Data.Tables;

namespace TmTracker.Models;

public record TrackedGame : ITableEntity
{
    public string RowKey { get; set; } = default!;

    public string PartitionKey { get; set; } = default!;

    public string Name { get; init; } = default!;
    
    public ETag ETag { get; set; } = default!;

    public DateTimeOffset? Timestamp { get; set; } = default!;

    public bool Drafting { get; set; } = true;

    public int Map { get; set; } = 1;

    public bool CorporateEra { get; set; } = true;

    public bool Prelude { get; set; } = true;

    public bool Promos { get; set; } = true;

    public bool Colonies { get; set; } = true;

    public bool VenusNext { get; set; } = false;

    public bool Turmoil { get; set; } = false;

    public bool JV { get; set; } = true;

    public bool T { get; set; } = true;

    public bool GM { get; set; } = true;

    public bool H { get; set; } = true;

    public DateTime? StartedAt { get; set; }

    public DateTime? EndedAt { get; set; }
}