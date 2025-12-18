using OrderMS.Domain.Entities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IFileRepository
{
    Task AddAsync(FileName fileName);
    Task AddAsync(IList<FileName> fileNames);
    Task<IReadOnlyList<FileName>> GetAllAsync();
    Task<FileName?> GetByIdAsync(Guid id);
    void Update(FileName fileName);
    Task<bool> Delete(string fileName, CancellationToken cancellationToken);
}