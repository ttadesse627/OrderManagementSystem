using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Requests;
using OrderMS.Application.Dtos.Users.Responses;
using OrderMS.Application.Features.Users.Commands.Create;
using OrderMS.Application.Features.Users.Commands.Delete;
using OrderMS.Application.Features.Users.Commands.Update;
using OrderMS.Application.Features.Users.Queries;
using OrderMS.Infrastructure;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(ApplicationDbContext context) : ApiControllerBase
{
    private readonly ApplicationDbContext _context = context;

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterRequest registerRequest)
    {
        return Created("", await _sender.Send(new CreateUserCommand(registerRequest)));
    }
    [Authorize]
    [HttpPut("{id}/update")]
    public async Task<ActionResult<ApiResponse<string>>> Update(Guid id, [FromBody] UpdateRequest updateRequest)
    {
        return Ok(await _sender.Send(new UpdateUserCommand(id, updateRequest)));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}/delete")]
    public async Task<ActionResult<ApiResponse<string>>> Delete(Guid id)
    {
        return Ok(await _sender.Send(new DeleteUserCommand(id)));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet(Name = "Users")]
    public async Task<ActionResult<UserDto>> Get(
        int currentPage = 1,
        int pageSize = 15,
        string? sortBy = null,
        bool sortDescending = false)
    {
        return Ok(await _sender.Send(new GetUsersQuery(currentPage, pageSize, sortBy, sortDescending)));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(Guid id)
    {
        return Ok(await _sender.Send(new GetUserByIdQuery(id)));
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        return Ok(await _sender.Send(new GetUserProfileQuery()));
    }

}