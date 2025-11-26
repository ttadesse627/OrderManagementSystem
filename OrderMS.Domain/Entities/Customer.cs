

namespace OrderMS.Domain.Entities
{
    public class Customer : BaseAuditableEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}