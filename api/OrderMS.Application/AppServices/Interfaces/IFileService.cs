
using Microsoft.AspNetCore.Http;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;

namespace OrderMS.Application.AppServices.Interfaces;

public interface IFileService
{
    ValidationResult IsValid(IFormFile file);
    Task<FileResource?> UploadAsync(IFormFile file, Guid id, string entityType);
    Task<IList<FileResource>> UploadFilesAsync(IList<IFormFile> files, Guid id, string entityType);
}