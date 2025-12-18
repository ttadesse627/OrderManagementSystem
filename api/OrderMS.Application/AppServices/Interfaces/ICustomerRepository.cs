using OrderMS.Domain.Entities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface ICustomerRepository : ICommonRepository<Customer>
{
    void Add(Customer customer);
    Task<IReadOnlyList<Customer>> GetAllAsync();
    Task<Customer?> GetByIdAsync(Guid id);
    void Delete(Customer customer);
}