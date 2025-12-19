

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderMS.Domain.Entities;
namespace OrderMS.Domain.EntityConfigurations;

public class ProductEntityTypeConfig : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(product => product.Id);

        builder.Property(product => product.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(pr => pr.RowVersion)
            .IsRowVersion()
            .IsConcurrencyToken()
            .ValueGeneratedOnAddOrUpdate();

        builder.HasOne<Category>()
           .WithMany()
           .HasForeignKey(product => product.CategoryId)
           .OnDelete(DeleteBehavior.Cascade);
    }
}
