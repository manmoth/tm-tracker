
using Azure;
using Azure.Data.Tables;

public record GameScores : ITableEntity
{
    public string RowKey { get; set; } = default!;

    public string PartitionKey { get; set; } = default!;
    
    public ETag ETag { get; set; } = default!;

    public DateTimeOffset? Timestamp { get; set; } = default!;

    public required string GameRowKey { get; set; }

    public int? JV { get; set; } = default!;

    public int? T { get; set; } = default!;

    public int? GM { get; set; } = default!;

    public int? H { get; set; } = default!;
}