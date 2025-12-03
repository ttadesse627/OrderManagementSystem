using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Items.Requests;
using OrderMS.Application.Dtos.Orders.Responses;
using OrderMS.Application.Features.Orders.Commands;
using OrderMS.Application.Features.Orders.Queries;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController(ILogger<OrderController> logger) : ApiControllerBase
{
    private readonly ILogger<OrderController> _logger = logger;

    [Authorize(Roles = "Customer")]
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<Guid>>> Create(List<OrderItemRequest> orderRequest)
    {
        return Created(string.Empty, await _sender.Send(new CreateOrderCommand(orderRequest)));
    }

    [Authorize(Roles = "Admin, User")]
    [HttpGet(Name = "GetOrders")]
    public async Task<ActionResult<IList<OrderDto>>> Get()
    {
        return Ok(await _sender.Send(new GetOrdersQuery()));
    }

    // [Authorize]
    // [HttpGet("cutomer/{customerId}")]
    // public async Task<ActionResult<ApiResponse<Guid>>> Get([FromQuery] Guid customerId)
    // {
    //     return Ok(await _sender.Send(new GetCutomerOrdersQuery(customerId)));
    // }

    // [HttpGet("{id}", Name = "GetById")]
    // public async Task<ActionResult<ApiResponse<Guid>>> Get(Guid id)
    // {
    //     return Ok(await _sender.Send(new GetOrdersQuery(currentPage, pageSize, sortBy, sortDescending)));
    // }

    // [Authorize(Roles = "Admin, User")]
    // [HttpPut("{id}", Name = "Update")]
    // public async Task<ActionResult<ApiResponse<int>>> Cancel(Guid id)
    // {
    //     return Ok(await _sender.Send(new UpdateOrderCommand(id)));
    // }

    // [HttpDelete("{id}", Name = "Cancel")]
    // public async Task<ActionResult<ApiResponse<int>>> Cancel(Guid id)
    // {
    //     return Ok(await _sender.Send(new DeleteOrderCommand(id)));
    // }
}