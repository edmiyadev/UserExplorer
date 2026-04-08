using FluentAssertions;
using UserExplorerApi.DTOs;

namespace UserExplorerApi.Tests.DTOs;

public class PaginatedResponseTests
{
    [Theory]
    [InlineData(10, 10, 1)]
    [InlineData(25, 10, 3)]
    [InlineData(0, 10, 0)]
    [InlineData(1, 10, 1)]
    [InlineData(11, 5, 3)]
    public void TotalPages_ShouldCalculateCorrectly(int totalCount, int pageSize, int expectedPages)
    {
        var response = new PaginatedResponse<object>
        {
            TotalCount = totalCount,
            PageSize = pageSize
        };

        response.TotalPages.Should().Be(expectedPages);
    }

    [Theory]
    [InlineData(1, 3, false)]
    [InlineData(2, 3, true)]
    [InlineData(3, 3, true)]
    public void HasPreviousPage_ShouldBeCorrect(int page, int totalPages, bool expected)
    {
        var response = new PaginatedResponse<object>
        {
            Page = page,
            PageSize = 10,
            TotalCount = totalPages * 10
        };

        response.HasPreviousPage.Should().Be(expected);
    }

    [Theory]
    [InlineData(1, 3, true)]
    [InlineData(2, 3, true)]
    [InlineData(3, 3, false)]
    public void HasNextPage_ShouldBeCorrect(int page, int totalPages, bool expected)
    {
        var response = new PaginatedResponse<object>
        {
            Page = page,
            PageSize = 10,
            TotalCount = totalPages * 10
        };

        response.HasNextPage.Should().Be(expected);
    }
}
