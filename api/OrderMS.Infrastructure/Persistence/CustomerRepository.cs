using Microsoft.EntityFrameworkCore;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence;

public class CustomerRepository(ApplicationDbContext context) : CommonRepository<Customer>(context), ICustomerRepository
{
    private readonly ApplicationDbContext _context = context;

    public void Add(Customer customer)
    {
        _context.Customers.Add(customer);
    }

    public async Task<IReadOnlyList<Customer>> GetAllAsync()
    {
        return await _context.Customers.AsNoTracking().ToListAsync();
    }

    public async Task<Customer?> GetByIdAsync(Guid id)
    {
        return await _context.Customers.AsNoTracking()
                    .Include(customer => customer.User)
                    .FirstOrDefaultAsync(i => i.Id == id);
    }

    public void Update(Customer customer)
    {
        _context.Customers.Update(customer);
    }

    public void Delete(Customer customer)
    {
        _context.Customers.Remove(customer);
    }
}
