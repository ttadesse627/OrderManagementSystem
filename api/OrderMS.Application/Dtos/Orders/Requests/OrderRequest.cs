


using OrderMS.Application.Dtos.Items.Requests;

namespace OrderMS.Application.Dtos.Orders.Requests;

public record OrderRequest
{
    public Guid CustomerId { get; set; }
    public List<OrderedItem> Items { get; set; } = [];
}