

using OrderMS.Application.Dtos.Customers.Responses;
using OrderMS.Application.Dtos.Products.Requests;
using OrderMS.Domain.Enums;

namespace OrderMS.Application.Dtos.Orders.Responses;

public class OrderDetailsDto
{
    public Guid Id { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal SubTotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal GrandTotal { get; set; }
    public OrderStatus Status { get; set; }
    public CustomerDto? Customer { get; set; }
    public ICollection<OrderedProduct> Products { get; set; } = [];
}