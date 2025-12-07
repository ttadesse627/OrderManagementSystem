using OrderMS.Domain.Entities;

namespace OrderMS.Application.Services;

public interface IProductRepository : ICommonRepository<Product>
{
    void Add(Product Product);
    Task<IReadOnlyList<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(Guid id);
    void Update(Product Product);
    void Delete(Product Product);
}