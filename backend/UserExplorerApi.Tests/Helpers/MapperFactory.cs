using AutoMapper;
using UserExplorerApi.Mapping;

namespace UserExplorerApi.Tests.Helpers;

/// <summary>
/// Provides a real AutoMapper IMapper instance configured with the application's mapping profile.
/// Used across tests to avoid mocking AutoMapper behaviour.
/// </summary>
public static class MapperFactory
{
    private static readonly Lazy<IMapper> _mapper = new(() =>
    {
        var config = new MapperConfiguration(new MapperConfigurationExpression());
        // We need to build the configuration with our profile
        return CreateMapperInstance();
    });

    private static IMapper CreateMapperInstance()
    {
        var expression = new MapperConfigurationExpression();
        expression.AddProfile<UserProfile>();
        var config = new MapperConfiguration(expression);
        config.AssertConfigurationIsValid();
        return config.CreateMapper();
    }

    public static IMapper Create() => _mapper.Value;
}
