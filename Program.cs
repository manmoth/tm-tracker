using Azure.Data.Tables;
using Azure.Identity;
using Mapster;
using MapsterMapper;
using TmTracker.Services;
using Yarp.ReverseProxy.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var mapperConfig = new TypeAdapterConfig();

mapperConfig.NewConfig<TmTracker.Entities.TrackedGame, TmTracker.Models.TrackedGame>()
    .Map(dest => dest.Id, src => src.RowKey)
    .Map(dest => dest.Ended, src => src.EndedAt != null);

mapperConfig.NewConfig<TmTracker.Entities.GameScores, TmTracker.Models.GameScores>()
    .Map(dest => dest.GameId, src => src.GameRowKey);

builder.Services.AddSingleton(mapperConfig);
builder.Services.AddScoped<IMapper, ServiceMapper>();

builder.Services.AddTransient<TrackedGameService>();

builder.Services.AddSingleton(s => {
        var tableConnStr = s.GetRequiredService<IConfiguration>().GetValue<string>("ConnectionStrings:AzureCosmosDb");
        var credential = new DefaultAzureCredential();

        return new TableServiceClient(tableConnStr);
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddReverseProxy()
        .LoadFromMemory(
            [
                new RouteConfig {
                    RouteId = "local",
                    ClusterId = "local",
                    Match = new RouteMatch { Path = "{**catch-all}" }
                }
            ],
            [
                new ClusterConfig {
                    ClusterId = "local",
                    Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
                    {
                        { "local", new DestinationConfig { Address = "http://localhost:5173" } }
                    }
                }
            ]
        );
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapReverseProxy();
} 
else 
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

app.MapControllers();

app.Run();
