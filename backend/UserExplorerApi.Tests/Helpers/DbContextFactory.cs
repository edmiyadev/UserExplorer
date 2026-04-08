using Microsoft.EntityFrameworkCore;
using UserExplorerApi.Data;

namespace UserExplorerApi.Tests.Helpers;

/// <summary>
/// Creates a fresh in-memory AppDbContext per test to ensure test isolation.
/// Each call returns a context backed by a unique in-memory database.
/// </summary>
public static class DbContextFactory
{
    public static AppDbContext Create()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }
}
