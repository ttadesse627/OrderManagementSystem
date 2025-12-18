using OrderMS.Domain.Entities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IProductRepository : ICommonRepository<Product>
{
    void Add(Product product);
    Task<IReadOnlyList<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product?> GetForUpdateAsync(Guid id);
    void Delete(Product product);
}