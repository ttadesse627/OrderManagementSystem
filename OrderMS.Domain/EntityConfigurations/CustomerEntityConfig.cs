

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderMS.Domain.Entities;

namespace OrderMS.Domain.EntityConfigurations;

public class CustomerEntityConfig : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.HasKey(customer => customer.Id);

        builder.HasOne<User>()
            .WithOne()
            .HasForeignKey<Customer>(customer => customer.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
