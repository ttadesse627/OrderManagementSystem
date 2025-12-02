

namespace OrderMS.Application.Dtos.Items.Requests;

public record OrderedItem
{
    public Guid ItemId { get; set; }
    public int Quantity { get; set; }
}
