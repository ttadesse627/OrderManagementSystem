using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Requests;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Features.Items.Commands;
using OrderMS.Application.Features.Items.Queries;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemController : ApiControllerBase
{
    [Authorize(Roles = "User, Admin")]
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<Guid>>> Create([FromForm] ItemRequest itemRequest, [FromForm] IFormFile itemImage)
    {
        return Created(string.Empty, await _sender.Send(new CreateItemCommand(itemRequest, itemImage)));
    }

    [HttpGet(Name = "GetItems")]
    public async Task<ActionResult<ApiResponse<Guid>>> Get([FromQuery]
        int currentPage = 1,
        int pageSize = 20,
        string? sortBy = null,
        bool sortDescending = false)
    {
        return Ok(await _sender.Send(new GetItemsQuery(currentPage, pageSize, sortBy, sortDescending)));
    }
}