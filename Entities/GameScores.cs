using Azure;
using Azure.Data.Tables;
using Mapster;

namespace TmTracker.Entities;

public record GameScores : ITableEntity
{
    [AdaptIgnore]
    public string RowKey { get; set; } = default!;

    [AdaptIgnore]
    public string PartitionKey { get; set; } = default!;

    [AdaptIgnore]
    public ETag ETag { get; set; } = default!;

    [AdaptIgnore]
    public DateTimeOffset? Timestamp { get; set; } = default!;

    public required string GameRowKey { get; set; }

    public int? JV { get; set; } = default!;

    public int? T { get; set; } = default!;

    public int? GM { get; set; } = default!;

    public int? H { get; set; } = default!;
}