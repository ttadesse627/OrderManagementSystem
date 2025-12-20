


using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderMS.Domain.Entities;

namespace OrderMS.Domain.EntityConfigurations;

public class FileResourceEntityTypeConfig : IEntityTypeConfiguration<FileResource>
{
    public void Configure(EntityTypeBuilder<FileResource> builder)
    {
        builder.Property(fr => fr.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(fr => fr.EntityType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(fr => fr.ContentType)
            .HasMaxLength(100);

        builder.Property(fr => fr.Size)
            .IsRequired();
    }
}