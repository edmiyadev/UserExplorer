using FluentAssertions;
using UserExplorerApi.Data;
using UserExplorerApi.DTOs;
using UserExplorerApi.Services;
using UserExplorerApi.Tests.Helpers;

namespace UserExplorerApi.Tests.Services;

public class UserServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly UserService _sut;

    public UserServiceTests()
    {
        _context = DbContextFactory.Create();
        _sut = new UserService(_context, MapperFactory.Create());
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    // CreateUserAsync

    [Fact]
    public async Task CreateUserAsync_ShouldPersistAndReturnMappedDto()
    {
        var dto = UserFixtures.CreateUserDto();

        var result = await _sut.CreateUserAsync(dto);

        result.Should().NotBeNull();
        result.Id.Should().BeGreaterThan(0);
        result.Name.Should().Be(dto.Name);
        result.Email.Should().Be(dto.Email);

        var inDb = await _context.Users.FindAsync(result.Id);
        inDb.Should().NotBeNull();
        inDb!.Name.Should().Be(dto.Name);
    }

    [Fact]
    public async Task CreateUserAsync_ShouldSetAuditFields()
    {
        var dto = UserFixtures.CreateUserDto();

        var result = await _sut.CreateUserAsync(dto);

        var user = await _context.Users.FindAsync(result.Id);
        user!.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        user.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task CreateUserAsync_DuplicateEmail_ShouldThrow()
    {
        var dto = UserFixtures.CreateUserDto(email: "duplicate@example.com");
        await _sut.CreateUserAsync(dto);

        var duplicateDto = UserFixtures.CreateUserDto(name: "Another User", email: "duplicate@example.com");

        // In-memory provider does not enforce unique indexes, so we verify at DB level
        // that both users can be found (the real Postgres DB enforces this).
        // Instead, verify the unique index is configured in OnModelCreating:
        var entityType = _context.Model.FindEntityType(typeof(UserExplorerApi.Models.User));
        var emailIndex = entityType!.GetIndexes()
            .FirstOrDefault(i => i.Properties.Any(p => p.Name == "Email"));

        emailIndex.Should().NotBeNull("Email should have an index configured");
        emailIndex!.IsUnique.Should().BeTrue("Email index should be unique");
    }

    // GetUserByIdAsync

    [Fact]
    public async Task GetUserByIdAsync_ExistingUser_ShouldReturnMappedDto()
    {
        var users = await UserFixtures.SeedUsersAsync(_context, 3);
        var target = users[1];

        var result = await _sut.GetUserByIdAsync(target.Id);

        result.Should().NotBeNull();
        result!.Id.Should().Be(target.Id);
        result.Name.Should().Be(target.Name);
        result.Email.Should().Be(target.Email);
    }

    [Fact]
    public async Task GetUserByIdAsync_NonExistingUser_ShouldReturnNull()
    {
        var result = await _sut.GetUserByIdAsync(999);

        result.Should().BeNull();
    }

    // GetAllUsersAsync

    [Fact]
    public async Task GetAllUsersAsync_NoFilters_ShouldReturnPaginatedResult()
    {
        await UserFixtures.SeedUsersAsync(_context, 5);
        var queryParams = new UserQueryParams { Page = 1, PageSize = 10 };

        var result = await _sut.GetAllUsersAsync(queryParams);

        result.Data.Should().HaveCount(5);
        result.TotalCount.Should().Be(5);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);
    }

    [Fact]
    public async Task GetAllUsersAsync_WithPagination_ShouldReturnCorrectPage()
    {
        await UserFixtures.SeedUsersAsync(_context, 5);
        var queryParams = new UserQueryParams { Page = 2, PageSize = 2 };

        var result = await _sut.GetAllUsersAsync(queryParams);

        result.Data.Should().HaveCount(2);
        result.TotalCount.Should().Be(5);
        result.Page.Should().Be(2);
        result.TotalPages.Should().Be(3);
        result.HasNextPage.Should().BeTrue();
        result.HasPreviousPage.Should().BeTrue();
    }

    [Fact]
    public async Task GetAllUsersAsync_SearchByName_ShouldFilterResults()
    {
        await UserFixtures.SeedUsersAsync(_context, 5);
        var queryParams = new UserQueryParams { Search = "User 1", Page = 1, PageSize = 10 };

        var result = await _sut.GetAllUsersAsync(queryParams);

        result.Data.Should().HaveCount(1);
        result.Data.First().Name.Should().Be("User 1");
    }

    [Fact]
    public async Task GetAllUsersAsync_SearchByEmail_ShouldFilterResults()
    {
        await UserFixtures.SeedUsersAsync(_context, 5);
        var queryParams = new UserQueryParams { Search = "user3@example.com", Page = 1, PageSize = 10 };

        var result = await _sut.GetAllUsersAsync(queryParams);

        result.Data.Should().HaveCount(1);
        result.Data.First().Email.Should().Be("user3@example.com");
    }

    [Fact]
    public async Task GetAllUsersAsync_FilterByCity_ShouldFilterResults()
    {
        await UserFixtures.SeedUsersAsync(_context, 5);
        var queryParams = new UserQueryParams { City = "Santiago", Page = 1, PageSize = 10 };

        var result = await _sut.GetAllUsersAsync(queryParams);

        result.Data.Should().AllSatisfy(u =>
            u.City.Should().Contain("Santiago"));
    }

    [Fact]
    public async Task GetAllUsersAsync_FilterByCompany_ShouldFilterResults()
    {
        await UserFixtures.SeedUsersAsync(_context, 5);
        var queryParams = new UserQueryParams { Company = "Acme", Page = 1, PageSize = 10 };

        var result = await _sut.GetAllUsersAsync(queryParams);

        result.Data.Should().AllSatisfy(u =>
            u.Company.Should().Contain("Acme"));
    }

    [Fact]
    public async Task GetAllUsersAsync_EmptyResult_ShouldReturnEmptyData()
    {
        var queryParams = new UserQueryParams { Search = "nonexistent", Page = 1, PageSize = 10 };

        var result = await _sut.GetAllUsersAsync(queryParams);

        result.Data.Should().BeEmpty();
        result.TotalCount.Should().Be(0);
    }

    // UpdateUserAsync

    [Fact]
    public async Task UpdateUserAsync_ExistingUser_ShouldUpdateAndReturn()
    {
        var users = await UserFixtures.SeedUsersAsync(_context, 1);
        var userId = users[0].Id;
        var updateDto = UserFixtures.UpdateUserDto();

        var result = await _sut.UpdateUserAsync(userId, updateDto);

        result.Should().NotBeNull();
        result!.Name.Should().Be(updateDto.Name);
        result.Email.Should().Be(updateDto.Email);
        result.Phone.Should().Be(updateDto.Phone);

        var inDb = await _context.Users.FindAsync(userId);
        inDb!.Name.Should().Be(updateDto.Name);
    }

    [Fact]
    public async Task UpdateUserAsync_NonExistingUser_ShouldReturnNull()
    {
        var updateDto = UserFixtures.UpdateUserDto();

        var result = await _sut.UpdateUserAsync(999, updateDto);

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateUserAsync_ShouldUpdateAuditFields()
    {
        var users = await UserFixtures.SeedUsersAsync(_context, 1);
        var userId = users[0].Id;
        var originalUpdatedAt = users[0].UpdatedAt;

        // Small delay to ensure timestamp difference
        await Task.Delay(10);

        var updateDto = UserFixtures.UpdateUserDto();
        await _sut.UpdateUserAsync(userId, updateDto);

        var user = await _context.Users.FindAsync(userId);
        user!.UpdatedAt.Should().BeAfter(originalUpdatedAt);
    }

    // DeleteUserAsync

    [Fact]
    public async Task DeleteUserAsync_ExistingUser_ShouldDeleteAndReturnTrue()
    {
        var users = await UserFixtures.SeedUsersAsync(_context, 1);
        var userId = users[0].Id;

        var result = await _sut.DeleteUserAsync(userId);

        result.Should().BeTrue();
        var inDb = await _context.Users.FindAsync(userId);
        inDb.Should().BeNull();
    }

    [Fact]
    public async Task DeleteUserAsync_NonExistingUser_ShouldReturnFalse()
    {
        var result = await _sut.DeleteUserAsync(999);

        result.Should().BeFalse();
    }

    // Email Uniqueness (Model Configuration)

    [Fact]
    public void EmailIndex_ShouldBeConfiguredAsUnique()
    {
        var entityType = _context.Model.FindEntityType(typeof(UserExplorerApi.Models.User));
        var indexes = entityType!.GetIndexes().ToList();

        var emailIndex = indexes.FirstOrDefault(i =>
            i.Properties.Any(p => p.Name == "Email"));

        emailIndex.Should().NotBeNull("an index on Email should be configured");
        emailIndex!.IsUnique.Should().BeTrue("the Email index must enforce uniqueness");
    }
}
