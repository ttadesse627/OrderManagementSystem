using Mapster;
using OrderMS.Application.Dtos.Products.Responses;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application;

public static class ObjectMapper
{
    private static readonly TypeAdapterConfig _config;

    static ObjectMapper()
    {
        _config = TypeAdapterConfig.GlobalSettings;

        _config.NewConfig<Product, ProductDto>();
        _config.NewConfig<ApplicationUser, UserDto>();
        _config.NewConfig<PaginatedResult<ApplicationUser>, PaginatedResult<UserDto>>();
    }

    public static TDestination MapTo<TDestination>(this object source)
    {
        return source.Adapt<TDestination>();
    }
}
