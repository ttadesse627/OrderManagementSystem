using OrderMS.Domain.Entities;
using System.Linq.Expressions;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application.Services;

public interface ICategoryRepository
{
    void AddAsync(Category category);
    Task<IReadOnlyList<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(Guid id);
    void Update(Category category);
    void Delete(Category category);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<PaginatedResult<Category>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false,
        Expression<Func<Category, bool>>? filter = null);
}
