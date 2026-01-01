
using OrderMS.Application.Dtos.Products.Responses;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IClientService
{
    Task<List<ProductResponse>> WarehouseProducts();
}