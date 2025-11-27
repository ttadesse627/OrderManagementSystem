

namespace OrderMS.Domain.Entities
{
    public class Customer : BaseAuditableEntity
    {
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;
    }
}