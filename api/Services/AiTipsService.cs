
using Microsoft.Extensions.AI;
using OpenAI;

namespace TmTracker.Services;

public class AiTipsService(IConfiguration configuration)
{
    public async Task<string> GetAiTip(string whoseTip)
    {
        var key = configuration["Ai:Tips:OpenAiKey"];
        var modelName = configuration["Ai:Tips:ModelName"];
        var prompt = configuration["Ai:Tips:Prompt"];
        var name = configuration[$"Names:{whoseTip}"];

        if (string.IsNullOrEmpty(key) || string.IsNullOrEmpty(modelName))
        {
            return "OpenAI key or model is not configured.";
        }

        IChatClient chatClient = new OpenAIClient(key).AsChatClient(modelName);

        List<ChatMessage> chatHistory = new()
        {
            new ChatMessage(ChatRole.System, prompt)
        };
        
        var tipPrompt = $"""
            Hva ville du sagt til {name}?
            """;

        chatHistory.Add(new ChatMessage(ChatRole.User, tipPrompt));

        var response = await chatClient.GetResponseAsync(chatHistory);

        return response.Text;
    }
}
