

using OrderMS.Application.Dtos.Items.Responses;

namespace OrderMS.Application.Dtos.Items.Requests;

public record OrderItemRequest
{
    public Guid ItemId { get; set; }
    public int Quantity { get; set; }
}
