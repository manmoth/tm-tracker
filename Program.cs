using Azure.Data.Tables;
using Azure.Identity;
using TmTracker.Components;
using TmTracker.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddTransient<TrackedGameService>();

builder.Services.AddSingleton(s => {
        var tableConnStr = s.GetRequiredService<IConfiguration>().GetValue<string>("ConnectionStrings:AzureCosmosDb");
        var credential = new DefaultAzureCredential();

        return new TableServiceClient(tableConnStr);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
