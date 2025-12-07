using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderMS.Domain.Entities;

namespace OrderMS.Domain.EntityConfigurations;

public class OrderEntityTypeConfig : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(order => order.Id);

        builder.HasMany(order => order.Products)
            .WithOne();
    }
}