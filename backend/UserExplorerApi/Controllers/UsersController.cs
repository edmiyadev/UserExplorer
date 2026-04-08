using Microsoft.AspNetCore.Mvc;
using UserExplorerApi.DTOs;
using UserExplorerApi.Services;

namespace UserExplorerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<UserResponseDto>>> GetUsers([FromQuery] UserQueryParams queryParams)
    {
        var result = await _userService.GetAllUsersAsync(queryParams);
        return Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);

        if (user == null)
            return NotFound(new { message = $"User with id {id} not found" });

        return Ok(user);
    }


    [HttpPost]
    public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _userService.IsEmailDuplicateAsync(createUserDto.Email))
            return Conflict(new { message = "Email already in use" });

        try
        {
            var user = await _userService.CreateUserAsync(createUserDto);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserResponseDto>> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _userService.IsEmailDuplicateAsync(updateUserDto.Email, id))
            return Conflict(new { message = "Email already in use" });

        try
        {
            var user = await _userService.UpdateUserAsync(id, updateUserDto);

            if (user == null)
                return NotFound(new { message = $"User with id {id} not found" });

            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userService.DeleteUserAsync(id);

        if (!deleted)
            return NotFound(new { message = $"User with id {id} not found" });

        return NoContent();
    }
}
