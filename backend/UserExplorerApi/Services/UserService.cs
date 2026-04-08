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

    public async Task<PaginatedResponse<UserResponseDto>> GetAllUsersAsync(UserQueryParams queryParams)
    {
        var query = _context.Users.AsQueryable();

        var searchTermLowered = queryParams.Search?.ToLower().Trim();
        var cityLowered = queryParams.City?.ToLower().Trim();
        var companyLowered = queryParams.Company?.ToLower().Trim();

        if (!string.IsNullOrWhiteSpace(queryParams.Search))
        {
            query = query.Where(u => u.Name.ToLower().Trim().Contains(searchTermLowered!) || u.Email.ToLower().Trim().Contains(searchTermLowered!));
        }

        if (!string.IsNullOrWhiteSpace(queryParams.City))
        {
            query = query.Where(u => u.City.ToLower().Trim() == cityLowered);
        }

        if (!string.IsNullOrWhiteSpace(queryParams.Company))
        {
            query = query.Where(u => u.Company.ToLower().Trim() == companyLowered);
        }

        var totalCount = await query.CountAsync();

        var users = await query
            .AsNoTracking()
            .OrderBy(u => u.Id)
            .Skip((queryParams.Page - 1) * queryParams.PageSize)
            .Take(queryParams.PageSize)
            .ToListAsync();

        return new PaginatedResponse<UserResponseDto>
        {
            Data = _mapper.Map<IEnumerable<UserResponseDto>>(users),
            Page = queryParams.Page,
            PageSize = queryParams.PageSize,
            TotalCount = totalCount
        };
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

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return _mapper.Map<UserResponseDto>(user);
    }

    public async Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return null;

        _mapper.Map(updateUserDto, user);
        await _context.SaveChangesAsync();

        return _mapper.Map<UserResponseDto>(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<int> GetUserCountAsync()
    {
        return await _context.Users.CountAsync();
    }
}
