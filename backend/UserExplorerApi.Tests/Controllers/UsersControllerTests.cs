using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UserExplorerApi.Controllers;
using UserExplorerApi.DTOs;
using UserExplorerApi.Services;
using UserExplorerApi.Tests.Helpers;

namespace UserExplorerApi.Tests.Controllers;

public class UsersControllerTests
{
    private readonly Mock<IUserService> _serviceMock;
    private readonly UsersController _sut;

    public UsersControllerTests()
    {
        _serviceMock = new Mock<IUserService>();
        _sut = new UsersController(_serviceMock.Object);
    }

    // GetUsers

    [Fact]
    public async Task GetUsers_ShouldReturnOkWithPaginatedResponse()
    {
        var queryParams = new UserQueryParams { Page = 1, PageSize = 10 };
        var expected = new PaginatedResponse<UserResponseDto>
        {
            Data = new List<UserResponseDto>
            {
                new() { Id = 1, Name = "User 1", Email = "u1@example.com" },
                new() { Id = 2, Name = "User 2", Email = "u2@example.com" },
            },
            Page = 1,
            PageSize = 10,
            TotalCount = 2
        };

        _serviceMock
            .Setup(s => s.GetAllUsersAsync(queryParams))
            .ReturnsAsync(expected);

        var result = await _sut.GetUsers(queryParams);

        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var body = okResult.Value.Should().BeOfType<PaginatedResponse<UserResponseDto>>().Subject;
        body.Data.Should().HaveCount(2);
        body.TotalCount.Should().Be(2);
    }

    // GetUserById

    [Fact]
    public async Task GetUserById_ExistingUser_ShouldReturnOk()
    {
        var userDto = new UserResponseDto { Id = 1, Name = "John Doe", Email = "john@example.com" };
        _serviceMock
            .Setup(s => s.GetUserByIdAsync(1))
            .ReturnsAsync(userDto);

        var result = await _sut.GetUserById(1);

        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var body = okResult.Value.Should().BeOfType<UserResponseDto>().Subject;
        body.Id.Should().Be(1);
        body.Name.Should().Be("John Doe");
    }

    [Fact]
    public async Task GetUserById_NonExistingUser_ShouldReturnNotFound()
    {
        _serviceMock
            .Setup(s => s.GetUserByIdAsync(999))
            .ReturnsAsync((UserResponseDto?)null);

        var result = await _sut.GetUserById(999);

        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    // CreateUser

    [Fact]
    public async Task CreateUser_ValidDto_ShouldReturnCreatedAtAction()
    {
        var createDto = UserFixtures.CreateUserDto();
        var responseDto = new UserResponseDto
        {
            Id = 1,
            Name = createDto.Name,
            Email = createDto.Email,
            Phone = createDto.Phone ?? string.Empty,
            Company = createDto.Company ?? string.Empty,
            City = createDto.City ?? string.Empty,
        };

        _serviceMock
            .Setup(s => s.CreateUserAsync(createDto))
            .ReturnsAsync(responseDto);

        var result = await _sut.CreateUser(createDto);

        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.ActionName.Should().Be(nameof(UsersController.GetUserById));
        createdResult.RouteValues!["id"].Should().Be(1);

        var body = createdResult.Value.Should().BeOfType<UserResponseDto>().Subject;
        body.Name.Should().Be(createDto.Name);
    }

    [Fact]
    public async Task CreateUser_ServiceThrows_ShouldReturnBadRequest()
    {
        var createDto = UserFixtures.CreateUserDto();
        _serviceMock
            .Setup(s => s.CreateUserAsync(createDto))
            .ThrowsAsync(new Exception("Duplicate email"));

        var result = await _sut.CreateUser(createDto);

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task CreateUser_InvalidModelState_ShouldReturnBadRequest()
    {
        _sut.ModelState.AddModelError("Name", "Name is required");
        var createDto = new CreateUserDto { Name = "", Email = "test@test.com" };

        var result = await _sut.CreateUser(createDto);

        result.Result.Should().BeOfType<BadRequestObjectResult>();
        _serviceMock.Verify(s => s.CreateUserAsync(It.IsAny<CreateUserDto>()), Times.Never);
    }

    // UpdateUser

    [Fact]
    public async Task UpdateUser_ExistingUser_ShouldReturnOk()
    {
        var updateDto = UserFixtures.UpdateUserDto();
        var responseDto = new UserResponseDto
        {
            Id = 1,
            Name = updateDto.Name,
            Email = updateDto.Email,
        };

        _serviceMock
            .Setup(s => s.UpdateUserAsync(1, updateDto))
            .ReturnsAsync(responseDto);

        var result = await _sut.UpdateUser(1, updateDto);

        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var body = okResult.Value.Should().BeOfType<UserResponseDto>().Subject;
        body.Name.Should().Be(updateDto.Name);
    }

    [Fact]
    public async Task UpdateUser_NonExistingUser_ShouldReturnNotFound()
    {
        var updateDto = UserFixtures.UpdateUserDto();
        _serviceMock
            .Setup(s => s.UpdateUserAsync(999, updateDto))
            .ReturnsAsync((UserResponseDto?)null);

        var result = await _sut.UpdateUser(999, updateDto);

        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task UpdateUser_ServiceThrows_ShouldReturnBadRequest()
    {
        var updateDto = UserFixtures.UpdateUserDto();
        _serviceMock
            .Setup(s => s.UpdateUserAsync(1, updateDto))
            .ThrowsAsync(new Exception("Constraint violation"));

        var result = await _sut.UpdateUser(1, updateDto);

        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task UpdateUser_InvalidModelState_ShouldReturnBadRequest()
    {
        _sut.ModelState.AddModelError("Email", "Invalid email format");
        var updateDto = new UpdateUserDto { Name = "Valid", Email = "bad" };

        var result = await _sut.UpdateUser(1, updateDto);

        result.Result.Should().BeOfType<BadRequestObjectResult>();
        _serviceMock.Verify(s => s.UpdateUserAsync(It.IsAny<int>(), It.IsAny<UpdateUserDto>()), Times.Never);
    }

    // DeleteUser

    [Fact]
    public async Task DeleteUser_ExistingUser_ShouldReturnNoContent()
    {
        _serviceMock
            .Setup(s => s.DeleteUserAsync(1))
            .ReturnsAsync(true);

        var result = await _sut.DeleteUser(1);

        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task DeleteUser_NonExistingUser_ShouldReturnNotFound()
    {
        _serviceMock
            .Setup(s => s.DeleteUserAsync(999))
            .ReturnsAsync(false);

        var result = await _sut.DeleteUser(999);

        result.Should().BeOfType<NotFoundObjectResult>();
    }
}
