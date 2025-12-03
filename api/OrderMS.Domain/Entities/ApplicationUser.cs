using Microsoft.AspNetCore.Identity;
using OrderMS.Domain.Enums;

namespace OrderMS.Domain.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public UserStatus Status { get; set; } = UserStatus.Active;
        public Customer? Customer { get; set; }
    }
}