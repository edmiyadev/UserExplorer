using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using UserExplorerApi.DTOs;

namespace UserExplorerApi.Tests.DTOs;

public class CreateUserDtoValidationTests
{
    private static List<ValidationResult> ValidateModel(object model)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(model);
        Validator.TryValidateObject(model, context, results, validateAllProperties: true);
        return results;
    }

    [Fact]
    public void ValidDto_ShouldHaveNoErrors()
    {
        var dto = new CreateUserDto
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "809-555-0001",
            Company = "Acme",
            City = "Santo Domingo"
        };

        var errors = ValidateModel(dto);
        errors.Should().BeEmpty();
    }

    [Theory]
    [InlineData("", "Email is required")]
    [InlineData(null, "Email is required")]
    public void EmptyOrNullName_ShouldFail(string? name, string _)
    {
        var dto = new CreateUserDto { Name = name!, Email = "valid@email.com" };

        var errors = ValidateModel(dto);
        errors.Should().Contain(e => e.MemberNames.Contains("Name"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    [InlineData("missing@")]
    public void InvalidEmail_ShouldFail(string email)
    {
        var dto = new CreateUserDto { Name = "Valid", Email = email };

        var errors = ValidateModel(dto);
        errors.Should().Contain(e => e.MemberNames.Contains("Email"));
    }

    [Fact]
    public void NameExceedingMaxLength_ShouldFail()
    {
        var dto = new CreateUserDto
        {
            Name = new string('A', 101),
            Email = "valid@email.com"
        };

        var errors = ValidateModel(dto);
        errors.Should().Contain(e => e.MemberNames.Contains("Name"));
    }

    [Fact]
    public void EmailExceedingMaxLength_ShouldFail()
    {
        var dto = new CreateUserDto
        {
            Name = "Valid",
            Email = new string('a', 142) + "@test.com" // 151 chars, exceeds MaxLength(150)
        };

        var errors = ValidateModel(dto);
        errors.Should().Contain(e => e.MemberNames.Contains("Email"));
    }

    [Fact]
    public void PhoneExceedingMaxLength_ShouldFail()
    {
        var dto = new CreateUserDto
        {
            Name = "Valid",
            Email = "valid@email.com",
            Phone = new string('1', 21)
        };

        var errors = ValidateModel(dto);
        errors.Should().Contain(e => e.MemberNames.Contains("Phone"));
    }

    [Fact]
    public void CompanyExceedingMaxLength_ShouldFail()
    {
        var dto = new CreateUserDto
        {
            Name = "Valid",
            Email = "valid@email.com",
            Company = new string('C', 101)
        };

        var errors = ValidateModel(dto);
        errors.Should().Contain(e => e.MemberNames.Contains("Company"));
    }

    [Fact]
    public void CityExceedingMaxLength_ShouldFail()
    {
        var dto = new CreateUserDto
        {
            Name = "Valid",
            Email = "valid@email.com",
            City = new string('C', 101)
        };

        var errors = ValidateModel(dto);
        errors.Should().Contain(e => e.MemberNames.Contains("City"));
    }

    [Fact]
    public void OptionalFields_Null_ShouldBeValid()
    {
        var dto = new CreateUserDto
        {
            Name = "Valid",
            Email = "valid@email.com",
            Phone = null,
            Company = null,
            City = null
        };

        var errors = ValidateModel(dto);
        errors.Should().BeEmpty();
    }
}
