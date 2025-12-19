
namespace OrderMS.Application.Dtos.Users.Requests;

public record UpdateProfileRequest
{
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Address { get; init; }
};