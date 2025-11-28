using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderMS.Domain.Entities;

namespace OrderMS.Domain.EntityConfigurations;

public class OrderEntityTypeConfig : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(order => order.Id);

        builder.HasOne<Customer>()
            .WithMany()
            .HasForeignKey(order => order.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(order => order.Items)
            .WithMany()
            .UsingEntity<OrderItem>(orderItem =>
            {
                orderItem.HasKey(oi => new { oi.OrderId, oi.ItemId });
            });
    }
}