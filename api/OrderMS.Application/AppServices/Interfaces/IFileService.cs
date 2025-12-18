
using Microsoft.AspNetCore.Http;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IFileService
{
    Task<string> UploadAsync(IFormFile file, Guid id);
    Task<IList<string>> UploadFilesAsync(IList<IFormFile> files, Guid id);

    (bool Success, string? ErrorMessage) IsValid(IFormFile file);

}