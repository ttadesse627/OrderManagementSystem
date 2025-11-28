using Microsoft.AspNetCore.Identity;

namespace OrderMS.Domain.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Address { get; set; }

        public Guid? CustomerId { get; set; }
        public Customer? Customer { get; set; }
    }
}