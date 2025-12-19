

namespace OrderMS.Application.Dtos.Users.Responses;

public record UserProfileDto
{
    public Guid Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Address { get; set; }
    public string? Email { get; set; }
}

