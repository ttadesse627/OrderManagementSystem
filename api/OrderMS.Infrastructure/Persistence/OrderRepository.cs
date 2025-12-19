using Microsoft.EntityFrameworkCore;
using OrderMS.Application.AppServices.Interfaces;
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
        return await _context.Orders.AsNoTracking()
                                    .Where(order => order.Status != OrderStatus.Delivered)
                                    .Include(order => order.Customer)
                                        .ThenInclude(customer => customer.User)
                                    .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(Guid id)
    {
        return await _context.Orders.AsNoTracking()
                    .Include(order => order.Items)
                        .ThenInclude(it => it.Product)
                    .Include(order => order.Customer)
                    .FirstOrDefaultAsync(i => i.Id == id);
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
