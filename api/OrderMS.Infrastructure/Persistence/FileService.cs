

using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using OrderMS.Application.Services;

namespace OrderMS.Infrastructure.Persistence;

public class FileService : IFileService
{
    public async Task UploadAsync(IFormFile file, Guid id)
    {
        string extension = Path.GetExtension(file.FileName);

        //File saving
        string fileName = id.ToString() + extension;
        string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        using FileStream fileStream = new(Path.Combine(pathToSave, fileName), FileMode.Create);
        await file.CopyToAsync(fileStream);
    }
    public Task<IFormFile> RetrieveAsync(Guid id)
    {
        throw new NotImplementedException();
    }

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
}