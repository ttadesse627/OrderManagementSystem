

namespace OrderMS.Domain.Entities
{
    public class OrderItem : BaseAuditableEntity
    {
        public Guid OrderId { get; set; }
        public Guid ItemId { get; set; }
        public int Quantity { get; set; }
    }
}