using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Requests;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Features.Items.Commands;
using OrderMS.Application.Features.Items.Queries;

namespace OrderMS.Api.Controllers;

public class ItemController : ControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<Guid>>> Create([FromBody] ItemRequest itemRequest)
    {
        return Created(string.Empty, new CreateItemCommand(itemRequest));
    }

    [HttpGet(Name = "GetItems")]
    public async Task<ActionResult<ApiResponse<Guid>>> Get([FromQuery]
        int currentPage = 1,
        int pageSize = 20,
        string? sortBy = null,
        bool sortDescending = false)
    {
        return Ok(new GetItemsQuery(currentPage, pageSize, sortBy, sortDescending));
    }
}