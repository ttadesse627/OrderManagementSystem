

namespace OrderMS.Domain.Entities
{
    public class Item : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
    }
}