using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Users.Responses;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoleController(IIdentityService identityService) : ApiControllerBase
{
    private readonly IIdentityService _identityService = identityService;

    [Authorize(Roles = "Admin")]
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<List<RoleDto>>>> Create(IList<string> roleNames)
    {
        ApiResponse<List<RoleDto>>? apiResponse = null;
        if (!roleNames.Any(role => role != null))
        {
            return BadRequest("No role names are provided.");
        }
        var result = await _identityService.CreateRolesAsync(roleNames);
        if (result)
        {
            var roles = await _identityService.GetRolesAsync();
            apiResponse = new ApiResponse<List<RoleDto>>
            {
                Data = roles,
                Message = "Successfully created the role",
                Success = true
            };
        }

        return Ok(apiResponse);
    }
    [Authorize(Roles = "Admin")]
    [HttpGet(Name = "Roles")]
    public async Task<ActionResult<List<RoleDto>>> Get()
    {
        return Ok(await _identityService.GetRolesAsync());
    }

}