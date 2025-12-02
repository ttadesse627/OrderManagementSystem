using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Enums;

namespace OrderMS.Infrastructure.Persistence;

public class OrderRepository(ApplicationDbContext context) : CommonRepository<Order>(context), IOrderRepository
{
    private readonly ApplicationDbContext _context = context;

    public void Add(Order order)
    {
        _context.Orders.Add(order);
    }

    public async Task<IReadOnlyList<Order>> GetAllAsync()
    {
        return await _context.Orders.AsNoTracking().Where(order => order.Status != OrderStatus.Delivered).ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(Guid id)
    {
        return await _context.Orders.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
    }

    public void Update(Order order)
    {
        _context.Orders.Update(order);
    }

    public void Delete(Order order)
    {
        _context.Orders.Remove(order);
    }
}
