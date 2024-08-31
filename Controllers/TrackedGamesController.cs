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

    [HttpGet("{season}")]
    public async Task<IEnumerable<Models.TrackedGame>> GetSeason(int season)
        => (await trackedGameService.GetGamesSeason(season))
            .OrderByDescending(g => g.StartedAt);

    [HttpPut]
    public async Task<IActionResult> Put([FromBody]Models.TrackedGame game) {
        var createdOrUpdatedGame = await trackedGameService.CreateOrUpdateGame(game);

        if(createdOrUpdatedGame is null)
            return BadRequest();

        return Ok(createdOrUpdatedGame);
    }
}
