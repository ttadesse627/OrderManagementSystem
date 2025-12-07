using Microsoft.EntityFrameworkCore;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence;

public class ProductRepository(ApplicationDbContext context) : CommonRepository<Product>(context), IProductRepository
{
    private readonly ApplicationDbContext _context = context;

    public void Add(Product Product)
    {
        _context.Products.Add(Product);
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync()
    {
        return await _context.Products.AsNoTracking().ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
    }

    public void Update(Product Product)
    {
        _context.Products.Update(Product);
    }

    public void Delete(Product Product)
    {
        _context.Products.Remove(Product);
    }

}
