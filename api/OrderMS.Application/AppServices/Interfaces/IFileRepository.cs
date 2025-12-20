using OrderMS.Domain.Entities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IFileRepository
{
    Task AddAsync(FileResource fileName);
    Task AddAsync(IList<FileResource> fileNames);
    Task<IReadOnlyList<FileResource>> GetAllAsync();
    Task<FileResource?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<string>> GetProductImageUrlsAsync(Guid productId);
    Task<string?> GetProductImageUrlAsync(Guid productId);
    void Update(FileResource fileName);
    Task<bool> Delete(string fileName, CancellationToken cancellationToken);
}