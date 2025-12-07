using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using OrderMS.Domain.Entities;
using OrderMS.Domain.EntityConfigurations;

namespace OrderMS.Infrastructure;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
: IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid, IdentityUserClaim<Guid>,
                    IdentityUserRole<Guid>, IdentityUserLogin<Guid>,
                    IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>(options)
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }

    // Fixed GUIDs and dates for seeding
    private static readonly Guid _adminRoleId = Guid.Parse("1cb8056d-ee6e-4320-9618-2ffa4946e11e");
    private static readonly Guid _userRoleId = Guid.Parse("ff3ce170-e1dc-4982-ac38-b6186c897e8b");
    private static readonly Guid _customerRoleId = Guid.Parse("c6bcfdb3-56a3-4bda-b6d5-1016f51b19cd");
    private static readonly Guid _adminUserId = Guid.Parse("2d7b6f3e-3c4e-4f5a-9f7b-8e9d6c4b5a1c");
    private static readonly string _adminUserSecurityStamp = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    private static readonly DateTime _fixedSeedDate = new(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new UserEntityTypeConfig());
        modelBuilder.ApplyConfiguration(new CustomerEntityTypeConfig());
        modelBuilder.ApplyConfiguration(new ProductEntityTypeConfig());
        modelBuilder.ApplyConfiguration(new OrderEntityTypeConfig());
        modelBuilder.ApplyConfiguration(new OrderProductEntityTypeConfig());

        SeedInitialData(modelBuilder);

    }

    private static void SeedInitialData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<IdentityRole<Guid>>().HasData(
            new IdentityRole<Guid>
            {
                Id = _adminRoleId,
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole<Guid>
            {
                Id = _userRoleId,
                Name = "User",
                NormalizedName = "USER"
            },
            new IdentityRole<Guid>
            {
                Id = _customerRoleId,
                Name = "Customer",
                NormalizedName = "CUSTOMER"
            }
        );

        var hasher = new PasswordHasher<ApplicationUser>();
        var adminUser = new ApplicationUser
        {
            Id = _adminUserId,
            FirstName = "System",
            LastName = "Administrator",
            Email = "admin@test.com",
            NormalizedEmail = "ADMIN@TEST.COM",
            UserName = "admin@test.com",
            NormalizedUserName = "ADMIN@TEST.COM",
            EmailConfirmed = true,
            PhoneNumber = null,
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            LockoutEnabled = true,
            AccessFailedCount = 0,
            LockoutEnd = null,
            ConcurrencyStamp = "user_concurrency_stamp_123", // Fixed
            SecurityStamp = _adminUserSecurityStamp, // Fixed string
            PasswordHash = "AQAAAAIAAYagAAAAEHx2QWfM8S4I8fO3l5z6K7V8n9o0pLmN1qR2sT3u4v5w6X7y8Z9a0b1c2d3e4f5g6h" // Fixed hash
        };

        modelBuilder.Entity<ApplicationUser>().HasData(adminUser);

        // 3. Seed UserRole
        modelBuilder.Entity<IdentityUserRole<Guid>>().HasData(
            new IdentityUserRole<Guid>
            {
                UserId = _adminUserId,
                RoleId = _adminRoleId
            }
        );

        modelBuilder.Entity<IdentityUserClaim<Guid>>().HasData(
            new IdentityUserClaim<Guid>
            {
                Id = 1,
                UserId = _adminUserId,
                ClaimType = JwtRegisteredClaimNames.Sub,
                ClaimValue = "2d7b6f3e-3c4e-4f5a-9f7b-8e9d6c4b5a1c"
            },
            new IdentityUserClaim<Guid>
            {
                Id = 2,
                UserId = _adminUserId,
                ClaimType = JwtRegisteredClaimNames.Email,
                ClaimValue = "admin@test.com"
            },
            new IdentityUserClaim<Guid>
            {
                Id = 3,
                UserId = _adminUserId,
                ClaimType = ClaimTypes.Role,
                ClaimValue = "Admin"
            }
        );
    }
}
