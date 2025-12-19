using Microsoft.EntityFrameworkCore;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Domain.Entities;

namespace OrderMS.Infrastructure.Persistence;

public class FileRepository(ApplicationDbContext context) : IFileRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task AddAsync(FileName fileName)
    {
        await _context.AddAsync(fileName);
    }

    public async Task AddAsync(IList<FileName> fileNames)
    {
        await _context.AddRangeAsync(fileNames);
    }

    public async Task<bool> Delete(string fileName, CancellationToken cancellationToken)
    {
        int result = await _context.FileNames
                    .Where(file => file.Name == fileName)
                    .ExecuteDeleteAsync();

        return result > 0;
    }

    public Task<IReadOnlyList<FileName>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<FileName?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public void Update(FileName fileName)
    {
        throw new NotImplementedException();
    }
}
