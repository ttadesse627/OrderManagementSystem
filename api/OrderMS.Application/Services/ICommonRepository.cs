using System.Linq.Expressions;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application.Services;

public interface ICommonRepository<T> where T : class
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<PaginatedResult<T>> GetPaginatedAsync(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false,
        Expression<Func<T, bool>>? filter = null);
}
