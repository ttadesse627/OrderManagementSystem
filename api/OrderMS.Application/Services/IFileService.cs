
using Microsoft.AspNetCore.Http;

namespace OrderMS.Application.Services;

public interface IFileService
{
    Task UploadAsync(IFormFile file, Guid id);
    Task<IFormFile> RetrieveAsync(Guid id);

    (bool Success, string? ErrorMessage) IsValid(IFormFile file);

}