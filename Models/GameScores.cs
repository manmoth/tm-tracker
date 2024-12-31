namespace TmTracker.Models;

public record GameScores
{
    public string GameId { get; set; } = default!;

    public int? JV { get; set; } = default!;

    public int? T { get; set; } = default!;

    public int? GM { get; set; } = default!;

    public int? H { get; set; } = default!;

    public bool? JVWonTieBreaker { get; set; } = default!;

    public bool? TWonTieBreaker { get; set; } = default!;

    public bool? HWonTieBreaker { get; set; } = default!;
    
    public bool? GMWonTieBreaker { get; set; } = default!;
}