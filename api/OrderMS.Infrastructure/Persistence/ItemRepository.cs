using Microsoft.EntityFrameworkCore;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence;

public class ItemRepository(ApplicationDbContext context) : CommonRepository<Item>(context), IItemRepository
{
    private readonly ApplicationDbContext _context = context;

    public void Add(Item item)
    {
        _context.Items.Add(item);
    }

    public async Task<IReadOnlyList<Item>> GetAllAsync()
    {
        return await _context.Items.AsNoTracking().ToListAsync();
    }

    public async Task<Item?> GetByIdAsync(Guid id)
    {
        return await _context.Items.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
    }

    public void Update(Item item)
    {
        _context.Items.Update(item);
    }

    public void Delete(Item item)
    {
        _context.Items.Remove(item);
    }

}
