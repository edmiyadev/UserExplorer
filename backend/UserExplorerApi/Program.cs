using Microsoft.EntityFrameworkCore;
using UserExplorerApi.Data;
using UserExplorerApi.Extensions;
using UserExplorerApi.Services;

var builder = WebApplication.CreateBuilder(args);


var connectionStrings = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionStrings));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


var app = builder.Build();

// Apply migrations on startup not recommended for production, but fine for development and testing
app.ApplyMigrations();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Habilitar CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
