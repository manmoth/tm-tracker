namespace TmTracker.Models;

public record TrackedGame
{
    public string Id {get; set; } = default!;

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

    public bool Ended { get; set; } = false;

    public DateTime? EndedAt { get; set; }
}