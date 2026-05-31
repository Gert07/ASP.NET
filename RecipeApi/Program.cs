using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using RecipeApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<RecipeContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<RecipeContext>();

    dbContext.Database.EnsureCreated();

    if (!dbContext.Recipes.Any())
    {
        dbContext.Recipes.Add(new()
        {
            Title = "Classic Pancakes",
            Description = "Fluffy breakfast pancakes.",
            Ingredients = "Flour, Milk, Eggs, Sugar",
            Instructions = "Mix ingredients. Cook on skillet.",
            PrepTimeMinutes = 15
        });

        dbContext.SaveChanges();
    }
}

var clientDistPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "recipe-client", "dist"));

if (Directory.Exists(clientDistPath))
{
    var clientFiles = new PhysicalFileProvider(clientDistPath);

    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = clientFiles
    });

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = clientFiles
    });
}

app.UseCors("AllowReact");
app.MapControllers();

if (Directory.Exists(clientDistPath))
{
    app.MapFallback(async context =>
    {
        context.Response.ContentType = "text/html";
        await context.Response.SendFileAsync(Path.Combine(clientDistPath, "index.html"));
    });
}

app.Run();
