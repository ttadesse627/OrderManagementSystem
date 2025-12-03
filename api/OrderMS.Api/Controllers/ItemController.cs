using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Items.Requests;
using OrderMS.Application.Features.Items.Commands.Create;
using OrderMS.Application.Features.Items.Commands.Delete;
using OrderMS.Application.Features.Items.Queries;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemController(ILogger<ItemController> logger) : ApiControllerBase
{
    private readonly ILogger<ItemController> _logger = logger;

    [Authorize(Roles = "User, Admin")]
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<Guid>>> Create([FromForm] ItemRequest itemRequest)
    {
        if (itemRequest.ItemImage == null)
        {
            _logger.LogError("File is missing");
        }
        return Created(string.Empty, await _sender.Send(new CreateItemCommand(itemRequest)));
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

    [Authorize(Roles = "Admin, User")]
    [HttpDelete("{id}", Name = "DeleteItems")]
    public async Task<ActionResult<ApiResponse<string>>> Delete(Guid id)
    {
        return Ok(await _sender.Send(new DeleteItemCommand(id)));
    }
}