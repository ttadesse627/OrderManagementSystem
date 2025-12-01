namespace OrderMS.Application.Dtos.Users.Requests;

public record UpdateRequest(
    string FirstName,
    string LastName,
    string Address,
    IList<string> Roles
);