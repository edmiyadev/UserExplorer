using System.ComponentModel.DataAnnotations;

namespace UserExplorerApi.DTOs;

public class UserQueryParams
{
    public string? Search { get; set; }
    public string? City { get; set; }
    public string? Company { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Page must be greater than 0")]
    public int Page { get; set; } = 1;

    [Range(1, 100, ErrorMessage = "PageSize must be between 1 and 100")]
    public int PageSize { get; set; } = 10;
}
