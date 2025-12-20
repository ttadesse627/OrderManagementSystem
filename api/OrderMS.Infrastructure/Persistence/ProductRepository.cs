using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;

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
        return await _context.Products
                    .AsNoTracking()
                    .Include(product => product.Category)
                    .FirstOrDefaultAsync(i => i.Id == id);
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

    public async Task<PaginatedResult<Product>> GetPaginatedResultAsync(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false,
        Expression<Func<Product, bool>>? filter = null)
    {
        IQueryable<Product> query = _context.Products
                                .AsNoTracking()
                                .Include(prod => prod.Category)
                                .Where(filter ?? (_ => true));

        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            query = ApplySorting(query, sortBy, sortDescending);
        }

        // Total count
        int totalCount = await query.CountAsync();

        // Pagination
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<Product>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    private static IQueryable<Product> ApplySorting(
        IQueryable<Product> query,
        string sortBy,
        bool sortDescending)
    {
        var parameter = Expression.Parameter(typeof(Product), "x");
        var property = Expression.PropertyOrField(parameter, sortBy);
        var lambda = Expression.Lambda(property, parameter);

        string methodName = sortDescending ? "OrderByDescending" : "OrderBy";

        var result = typeof(Queryable).GetMethods()
            .First(m =>
                m.Name == methodName &&
                m.GetParameters().Length == 2)
            .MakeGenericMethod(typeof(Product), property.Type)
            .Invoke(null, [query, lambda]);

        return (IQueryable<Product>)result!;
    }
}
