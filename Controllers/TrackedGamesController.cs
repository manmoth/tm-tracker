using Mapster;
using Microsoft.AspNetCore.Mvc;
using TmTracker.Services;

namespace TmTracker.Controllers;

[ApiController]
[Route("[controller]")]
public class TrackedGamesController(TrackedGameService trackedGameService) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<Models.TrackedGame>> Get()
        => (await trackedGameService.GetGames())
            .OrderByDescending(g => g.StartedAt);

    [HttpPatch]
    public async Task Patch([FromBody]Models.TrackedGame game)
        => await trackedGameService.UpdateGame(game);
}
