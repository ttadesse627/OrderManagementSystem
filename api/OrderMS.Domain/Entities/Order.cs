

using OrderMS.Domain.Enums;

namespace OrderMS.Domain.Entities
{
    public class Order : BaseAuditableEntity
    {
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Ordered;
        public ICollection<OrderProduct> Products { get; set; } = [];
    }
}