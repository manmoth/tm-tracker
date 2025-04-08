using Microsoft.AspNetCore.Mvc;
using TmTracker.Services;

namespace TmTracker.Controllers;

[ApiController]
[Route("[controller]")]
public class TipsController(AiTipsService aiTipsService) : ControllerBase
{
    [HttpGet]
    public async Task<Tip> Get()
        => new (await aiTipsService.GetAiTip("jv"), await aiTipsService.GetAiTip("h"), await aiTipsService.GetAiTip("gm"), await aiTipsService.GetAiTip("t"));
}

public record Tip(string TextJv, string TextH, string TextGm, string TextT);