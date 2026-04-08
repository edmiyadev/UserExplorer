using UserExplorerApi.Data;
using UserExplorerApi.DTOs;
using UserExplorerApi.Models;

namespace UserExplorerApi.Tests.Helpers;

/// <summary>
/// Shared test data builders for User entities and DTOs.
/// Provides consistent, predictable test data across all test classes.
/// </summary>
public static class UserFixtures
{
    public static User CreateUser(
        int id = 1,
        string name = "John Doe",
        string email = "john@example.com",
        string phone = "809-555-0001",
        string company = "Acme Corp",
        string city = "Santo Domingo")
    {
        return new User
        {
            Id = id,
            Name = name,
            Email = email,
            Phone = phone,
            Company = company,
            City = city
        };
    }

    public static CreateUserDto CreateUserDto(
        string name = "Jane Smith",
        string email = "jane@example.com",
        string phone = "809-555-0002",
        string company = "Globex Inc",
        string city = "Santiago")
    {
        return new CreateUserDto
        {
            Name = name,
            Email = email,
            Phone = phone,
            Company = company,
            City = city
        };
    }

    public static UpdateUserDto UpdateUserDto(
        string name = "Updated Name",
        string email = "updated@example.com",
        string phone = "809-555-9999",
        string company = "Updated Corp",
        string city = "La Vega")
    {
        return new UpdateUserDto
        {
            Name = name,
            Email = email,
            Phone = phone,
            Company = company,
            City = city
        };
    }

    /// <summary>
    /// Seeds the database with a set of users for list/filter tests.
    /// </summary>
    public static async Task<List<User>> SeedUsersAsync(AppDbContext context, int count = 5)
    {
        var users = new List<User>();
        var cities = new[] { "Santo Domingo", "Santiago", "La Vega", "Puerto Plata", "San Cristóbal" };
        var companies = new[] { "Acme Corp", "Globex Inc", "StartUp LLC", "Tech SA", "Dev Co" };

        for (int i = 1; i <= count; i++)
        {
            users.Add(new User
            {
                Name = $"User {i}",
                Email = $"user{i}@example.com",
                Phone = $"809-555-{i:D4}",
                Company = companies[(i - 1) % companies.Length],
                City = cities[(i - 1) % cities.Length]
            });
        }

        context.Users.AddRange(users);
        await context.SaveChangesAsync();
        return users;
    }
}
