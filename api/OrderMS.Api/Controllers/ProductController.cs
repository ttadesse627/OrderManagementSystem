using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Products.Requests;
using OrderMS.Application.Features.Products.Commands.Create;
using OrderMS.Application.Features.Products.Commands.Delete;
using OrderMS.Application.Features.Products.Queries;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(ILogger<ProductController> logger) : ApiControllerBase
{
    private readonly ILogger<ProductController> _logger = logger;

    [Authorize(Roles = "User, Admin")]
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<Guid>>> Create([FromForm] ProductRequest productRequest)
    {
        if (productRequest.ProductImage == null)
        {
            _logger.LogError("File is missing");
        }
        return Created(string.Empty, await _sender.Send(new CreateProductCommand(productRequest)));
    }

    [HttpGet(Name = "GetProducts")]
    public async Task<IActionResult> Get([FromQuery]
        int currentPage = 1,
        int pageSize = 20,
        string? sortBy = null,
        bool sortDescending = false)
    {
        return Ok(await _sender.Send(new GetProductsQuery(currentPage, pageSize, sortBy, sortDescending)));
    }

    [Authorize(Roles = "Admin, User")]
    [HttpDelete("{id}", Name = "DeleteProducts")]
    public async Task<ActionResult<ApiResponse<string>>> Delete(Guid id)
    {
        return Ok(await _sender.Send(new DeleteProductCommand(id)));
    }
}