
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Domain.Entities;
using OrderMS.Domain.Utilities;
using OrderMS.Domain.Utilities.Enums;

namespace OrderMS.Infrastructure.Persistence;

public class FileService(ILogger<FileService> logger, IWebHostEnvironment hostEnvironment) : IFileService
{
    private readonly ILogger<FileService> _logger = logger;
    private readonly IWebHostEnvironment _env = hostEnvironment;

    public ValidationResult IsValid(IFormFile file)
    {
        // Get File Extension
        List<string> validExtensions = [".jpg", ".png", ".gif"];
        string extension = Path.GetExtension(file.FileName);
        if (!validExtensions.Contains(extension))
        {
            string message = $"The extension {extension} is not supported."
                                    + $"Valid extensions are {string.Join(",", validExtensions)}.";
            return new ValidationResult(false, message, Severity.Error);
        }

        long maxFileSize = 5 * 1024 * 1024; //Limited to 5MB

        // Validate File size
        long fileSize = file.Length;
        if (fileSize > maxFileSize)
        {
            string message = $"The size of your file exceeds maximum supported file size {maxFileSize}.";
            return new ValidationResult(false, message, Severity.Error);
        }

        return new ValidationResult(true, null, Severity.Info);
    }

    public async Task<FileResource?> UploadAsync(IFormFile file, Guid id, string entityType)
    {
        string webRoot = _env.WebRootPath;

        string objectFolder = Path.Combine(webRoot, "uploads");
        string extension = Path.GetExtension(file.FileName);

        //File saving
        string fileName = id.ToString() + extension;
        FileResource? fileResource = null;

        try
        {
            await using FileStream fileStream = new(Path.Combine(objectFolder, fileName), FileMode.Create);
            await file.CopyToAsync(fileStream);

            fileResource = new FileResource
            {
                Name = $"/uploads/{id}/{fileName}",
                EntityType = entityType,
                ContentType = file.ContentType,
                Size = file.Length
            };
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Error occurred while trying to save file.");
        }

        return fileResource;
    }

    public async Task<IList<FileResource>> UploadFilesAsync(IList<IFormFile> files, Guid id, string entityType)
    {
        // Determine the webroot directory (wwwroot)
        string webRoot = _env.WebRootPath;

        string objectFolder = Path.Combine(webRoot, "uploads", id.ToString());

        if (!Directory.Exists(objectFolder))
        {
            Directory.CreateDirectory(objectFolder);
        }

        List<FileResource> fileResources = [];

        foreach (var file in files)
        {
            string extension = Path.GetExtension(file.FileName);
            string fileName = file.FileName;
            string fullPath = Path.Combine(objectFolder, fileName);

            try
            {
                await using var stream = new FileStream(fullPath, FileMode.Create);
                await file.CopyToAsync(stream);

                FileResource fileResource = new()
                {
                    Name = $"/uploads/{id}/{fileName}",
                    EntityType = entityType,
                    ContentType = file.ContentType,
                    Size = file.Length
                };
                // Build a URL that the client can use to access this file
                fileResources.Add(fileResource);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error saving file {fileName} for user {id}", ex);
            }
        }

        return fileResources;
    }
}