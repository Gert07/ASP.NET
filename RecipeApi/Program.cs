using Microsoft.EntityFrameworkCore;
using RecipeApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<RecipeCotext>(FileOptions =>
    FileOptions.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(FileOptions =>
{
    FileOptions.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("https://localhost:5500").AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddControllers();
var app = builder.Services.Build();

app.UseCors("AllowReact");
app.MapControllers();
app.Run();