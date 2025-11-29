using OrderMS.Domain.Entities;

namespace OrderMS.Application.Services;

public interface IItemRepository : ICommonRepository<Item>
{
    void Add(Item item);
    Task<IReadOnlyList<Item>> GetAllAsync();
    Task<Item?> GetByIdAsync(Guid id);
    void Update(Item item);
    void Delete(Item item);
}