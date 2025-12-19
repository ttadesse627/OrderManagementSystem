

using System.ComponentModel.DataAnnotations;

namespace OrderMS.Domain.Entities
{
    public class Product : BaseAuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal TaxRate { get; set; }
        public int StockQuantity { get; set; }
        public Guid CategoryId { get; set; }
        public string? ImageUrl { get; set; }
        [Timestamp]
        public uint RowVersion { get; set; }
    }
}