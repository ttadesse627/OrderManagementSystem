using System.Linq.Expressions;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IProductRepository : ICommonRepository<Product>
{
    void Add(Product product);
    Task<IReadOnlyList<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product?> GetForUpdateAsync(Guid id);
    Task<PaginatedResult<Product>> GetPaginatedResultAsync(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        bool sortDescending = false,
        Expression<Func<Product, bool>>? filter = null);
    void Delete(Product product);
}
