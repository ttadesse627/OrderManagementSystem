using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderMS.Domain.Entities;

namespace OrderMS.Domain.EntityConfigurations;

public class OrderProductEntityTypeConfig : IEntityTypeConfiguration<OrderProduct>
{
    public void Configure(EntityTypeBuilder<OrderProduct> builder)
    {
        builder.HasKey(oi => new { oi.OrderId, oi.ProductId });

        builder.HasOne(oi => oi.Order)
            .WithMany(o => o.Products)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId);

    }
}