using Microsoft.EntityFrameworkCore;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence;

public class FileRepository(ApplicationDbContext context) : IFileRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task AddAsync(FileResource fileName)
    {
        await _context.AddAsync(fileName);
    }

    public async Task AddAsync(IList<FileResource> fileNames)
    {
        await _context.AddRangeAsync(fileNames);
    }

    public async Task<bool> Delete(string fileName, CancellationToken cancellationToken)
    {
        int result = await _context.FileResources
                    .Where(file => file.Name == fileName)
                    .ExecuteDeleteAsync();

        return result > 0;
    }

    public async Task<IReadOnlyList<string>> GetProductImageUrlsAsync(Guid productId)
    {
        return await _context.FileResources
            .AsNoTracking()
            .Where(file => file.Name.StartsWith($"/uploads/{productId}"))
            .Select(file => file.Name)
            .ToListAsync();
    }

    public async Task<string?> GetProductImageUrlAsync(Guid productId)
    {
        return await _context.FileResources
            .AsNoTracking()
            .Where(file => file.Name.StartsWith($"/uploads/{productId}"))
            .Select(file => file.Name)
            .FirstOrDefaultAsync();
    }

    public Task<IReadOnlyList<FileResource>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<FileResource?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public void Update(FileResource fileName)
    {
        throw new NotImplementedException();
    }
}
