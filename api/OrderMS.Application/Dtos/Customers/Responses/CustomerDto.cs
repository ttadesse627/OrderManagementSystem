

namespace OrderMS.Application.Dtos.Customers.Responses;

public record CustomerDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Address { get; set; }
    public string? Email { get; set; }
}

