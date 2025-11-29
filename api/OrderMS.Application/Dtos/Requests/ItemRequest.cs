
namespace OrderMS.Application.Dtos.Requests;

public record ItemRequest(
    string Name,
    decimal Price,
    int StockQuantity,
    Guid CategoryId
);