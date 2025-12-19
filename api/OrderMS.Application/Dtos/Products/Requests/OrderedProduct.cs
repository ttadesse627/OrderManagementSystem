

using OrderMS.Application.Dtos.Products.Responses;

namespace OrderMS.Application.Dtos.Products.Requests;

public record OrderedProduct
{
    public ProductDto? Product { get; set; }
    public int Quantity { get; set; }
    public decimal TaxRate { get; set; }
}
