using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;

namespace OrderMS.Infrastructure.Persistence;

public class CategoryRepository(ApplicationDbContext context) : ICategoryRepository
{
    private readonly ApplicationDbContext _context = context;

    public void AddAsync(Category category)
    {
        _context.Categories.Add(category);
    }

    public async Task<IReadOnlyList<Category>> GetAllAsync()
    {
        return await _context.Categories.AsNoTracking().ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        return await _context.Categories.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
    }

    public void Update(Category category)
    {
        _context.Categories.Update(category);
    }

    public void Delete(Category category)
    {
        _context.Categories.Remove(category);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<PaginatedResult<Category>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false,
        Expression<Func<Category, bool>>? filter = null)
    {
        IQueryable<Category> query = _context.Categories.AsQueryable();

        if (filter != null)
        {
            query = query.Where(filter);
        }

        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            query = ApplySorting(query, sortBy, sortDescending);
        }
        else
        {
            query = query.OrderBy(x => x.Id);
        }

        int totalCount = await query.CountAsync();

        var categories = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return new PaginatedResult<Category>
        {
            Items = categories,
            CurrentPage = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    private static IQueryable<Category> ApplySorting(
        IQueryable<Category> query,
        string sortBy,
        bool sortDescending)
    {
        var parameter = Expression.Parameter(typeof(Category), "x");
        var property = Expression.PropertyOrField(parameter, sortBy);
        var lambda = Expression.Lambda(property, parameter);

        string methodName = sortDescending ? "OrderByDescending" : "OrderBy";

        var result = typeof(Queryable).GetMethods()
            .First(m =>
                m.Name == methodName &&
                m.GetParameters().Length == 2)
            .MakeGenericMethod(typeof(Category), property.Type)
            .Invoke(null, [query, lambda]);

        return (IQueryable<Category>)result!;
    }
}
