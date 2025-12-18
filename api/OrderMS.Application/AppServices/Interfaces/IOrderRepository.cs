using OrderMS.Domain.Entities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IOrderRepository : ICommonRepository<Order>
{
    void Add(Order order);
    Task<IReadOnlyList<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(Guid id);
    void Update(Order order);
    void Delete(Order order);
}