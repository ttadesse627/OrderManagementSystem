using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using OrderMS.Application.Services;
using OrderMS.Domain.Utilities;

namespace OrderMS.Infrastructure.Persistence;

public class CommonRepository<T>(ApplicationDbContext context) : ICommonRepository<T> where T : class
{
    private readonly ApplicationDbContext _context = context;


    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<PaginatedResult<T>> GetPaginatedAsync(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false,
        Expression<Func<T, bool>>? filter = null)
    {
        IQueryable<T> query = _context.Set<T>();

        if (filter != null)
        {
            query = query.Where(filter);
        }

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
            .AsNoTracking()
            .ToListAsync();

        return new PaginatedResult<T>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    private static IQueryable<T> ApplySorting(
        IQueryable<T> query,
        string sortBy,
        bool sortDescending)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.PropertyOrField(parameter, sortBy);
        var lambda = Expression.Lambda(property, parameter);

        string methodName = sortDescending ? "OrderByDescending" : "OrderBy";

        var result = typeof(Queryable).GetMethods()
            .First(m =>
                m.Name == methodName &&
                m.GetParameters().Length == 2)
            .MakeGenericMethod(typeof(T), property.Type)
            .Invoke(null, [query, lambda]);

        return (IQueryable<T>)result!;
    }

    public async Task<IList<T>> GetFilteredValuesAsync(Expression<Func<T, bool>>? filter = null)
    {
        if (filter is null)
        {
            return await _context.Set<T>().ToListAsync();
        }
        return await _context.Set<T>().Where(filter).ToListAsync();
    }
}
