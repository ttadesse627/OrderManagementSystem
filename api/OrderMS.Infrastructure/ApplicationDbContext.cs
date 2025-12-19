using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
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
    public DbSet<FileName> FileNames { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

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
        modelBuilder.ApplyConfiguration(new RefreshTokenEntityTypeConfig());

    }
}
