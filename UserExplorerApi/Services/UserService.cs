using AutoMapper;
using Microsoft.EntityFrameworkCore;
using UserExplorerApi.Data;
using UserExplorerApi.DTOs;
using UserExplorerApi.Models;

namespace UserExplorerApi.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public UserService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync(string? search, string? city, string? company)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(u => u.Name.Contains(search) || u.Email.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(city))
        {
            query = query.Where(u => u.City == city);
        }

        if (!string.IsNullOrWhiteSpace(company))
        {
            query = query.Where(u => u.Company == company);
        }

        var users = await query.ToListAsync();

        return _mapper.Map<IEnumerable<UserResponseDto>>(users);
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        
        if (user == null)
            return null;

        return _mapper.Map<UserResponseDto>(user);
    }

    public async Task<UserResponseDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        var user = _mapper.Map<User>(createUserDto);

        _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return _mapper.Map<UserResponseDto>(user);
    }
}
