

namespace OrderMS.Application.Dtos.Requests;

public record RegisterRequest(
    string FirstName,
    string LastName,
    IList<Guid> Roles,
    string Email,
    string Password
);