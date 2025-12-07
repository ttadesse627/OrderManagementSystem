
using Microsoft.AspNetCore.Http;

namespace OrderMS.Application.Services;

public interface IFileService
{
    Task<string> UploadAsync(IFormFile file, Guid id);

    (bool Success, string? ErrorMessage) IsValid(IFormFile file);

}