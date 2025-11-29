using Mapster;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Domain.Entities;

namespace OrderMS.Application;

public static class ObjectMapper
{
    private static readonly TypeAdapterConfig _config;

    static ObjectMapper()
    {
        _config = TypeAdapterConfig.GlobalSettings;

        _config.NewConfig<Item, ItemDto>();
    }

    public static TDestination MapTo<TDestination>(this object source)
    {
        return source.Adapt<TDestination>();
    }
}
