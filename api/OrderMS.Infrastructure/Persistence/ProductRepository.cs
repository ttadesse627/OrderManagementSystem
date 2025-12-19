using Microsoft.EntityFrameworkCore;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence;

public class ProductRepository(ApplicationDbContext context) : CommonRepository<Product>(context), IProductRepository
{
    private readonly ApplicationDbContext _context = context;

    public void Add(Product product)
    {
        _context.Products.Add(product);
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync()
    {
        return await _context.Products.AsNoTracking().ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
    }

    public void Update(Product product)
    {
        _context.Products.Update(product);
    }

    public void Delete(Product product)
    {
        _context.Products.Remove(product);
    }

    public async Task<Product?> GetForUpdateAsync(Guid id)
    {
        return await _context.Products.FirstOrDefaultAsync(i => i.Id == id);
    }
}
