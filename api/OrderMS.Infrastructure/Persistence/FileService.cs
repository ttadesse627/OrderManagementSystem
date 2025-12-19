
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using OrderMS.Application.AppServices.Interfaces;

namespace OrderMS.Infrastructure.Persistence;

public class FileService(ILogger<FileService> logger, IWebHostEnvironment hostEnvironment) : IFileService
{
    private readonly ILogger<FileService> _logger = logger;
    private readonly IWebHostEnvironment _env = hostEnvironment;

    public (bool Success, string? ErrorMessage) IsValid(IFormFile file)
    {
        // Get File Extension
        List<string> validExtensions = [".jpg", ".png", ".gif"];
        string extension = Path.GetExtension(file.FileName);
        if (!validExtensions.Contains(extension))
        {
            string message = $"The extension {extension} is not supported."
                                    + $"Valid extensions are {string.Join(",", validExtensions)}.";
            return (false, message);
        }

        long maxFileSize = 5 * 1024 * 1024; //Limited to 5MB

        // Validate File size
        long fileSize = file.Length;
        if (fileSize > (maxFileSize))
        {
            string message = $"The size of your file exceeds maximum supported file size {maxFileSize}.";
            return (false, message);
        }

        return (true, null);
    }

    public async Task<string> UploadAsync(IFormFile file, Guid id)
    {
        string extension = Path.GetExtension(file.FileName);

        //File saving
        string fileName = id.ToString() + extension;
        string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

        try
        {
            await using FileStream fileStream = new(Path.Combine(pathToSave, fileName), FileMode.Create);
            await file.CopyToAsync(fileStream);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Error occurred while trying to save file.");
        }

        return fileName;
    }

    public async Task<IList<string>> UploadFilesAsync(IList<IFormFile> files, Guid id)
    {
        // Determine the webroot directory (wwwroot)
        string webRoot = _env.WebRootPath;

        string userFolder = Path.Combine(webRoot, "uploads", id.ToString());

        if (!Directory.Exists(userFolder))
        {
            Directory.CreateDirectory(userFolder);
        }

        var fileUrls = new List<string>();
        int counter = 0;

        foreach (var file in files)
        {
            string extension = Path.GetExtension(file.FileName);
            string fileName = $"{id}_{counter}{extension}";
            string fullPath = Path.Combine(userFolder, fileName);

            try
            {
                await using var stream = new FileStream(fullPath, FileMode.Create);
                await file.CopyToAsync(stream);

                // Build a URL that the client can use to access this file
                string publicUrl = $"/uploads/{id}/{fileName}";
                fileUrls.Add(publicUrl);
                counter++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file {FileName} for user {UserId}", fileName, id);
            }
        }

        return fileUrls;
    }
}