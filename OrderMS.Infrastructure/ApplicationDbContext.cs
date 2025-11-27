using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OrderMS.Domain.Entities;
using OrderMS.Domain.EntityConfigurations;

namespace OrderMS.Infrastructure;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
: IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new UserEntityTypeConfig());
        modelBuilder.ApplyConfiguration(new CustomerEntityTypeConfig());
        modelBuilder.ApplyConfiguration(new ItemEntityTypeConfig());
        modelBuilder.ApplyConfiguration(new OrderEntityTypeConfig());

        SeedInitialData(modelBuilder);

    }

    private static void SeedInitialData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<IdentityRole<Guid>>().HasData(
            new IdentityRole<Guid>
            {
                Id = Guid.Parse("1cb8056d-ee6e-4320-9618-2ffa4946e11e"),
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole<Guid>
            {
                Id = Guid.Parse("ff3ce170-e1dc-4982-ac38-b6186c897e8b"),
                Name = "User",
                NormalizedName = "USER"
            },
            new IdentityRole<Guid>
            {
                Id = Guid.Parse("c6bcfdb3-56a3-4bda-b6d5-1016f51b19cd"),
                Name = "Cutomer",
                NormalizedName = "CUSTOMER"
            }
        );

        var hasher = new PasswordHasher<ApplicationUser>();
        var adminUser = new ApplicationUser
        {
            Id = Guid.Parse("2d7b6f3e-3c4e-4f5a-9f7b-8e9d6c4b5a1c"),
            FirstName = "System",
            LastName = "Administrator",
            Email = "admin@test.com",
            NormalizedEmail = "ADMIN@TEST.COM",
            UserName = "admin@test.com",
            NormalizedUserName = "ADMIN@TEST.COM",
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString("D")
        };

        adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin123!");

        modelBuilder.Entity<ApplicationUser>().HasData(adminUser);

        // 3. Seed UserRole
        modelBuilder.Entity<IdentityUserRole<Guid>>().HasData(
            new IdentityUserRole<Guid>
            {
                UserId = Guid.Parse("2d7b6f3e-3c4e-4f5a-9f7b-8e9d6c4b5a1c"),
                RoleId = Guid.Parse("1cb8056d-ee6e-4320-9618-2ffa4946e11e")
            }
        );
    }
}
