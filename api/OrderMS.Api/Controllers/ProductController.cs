using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Dtos.Products.Requests;
using OrderMS.Application.Dtos.Products.Responses;
using OrderMS.Application.Features.Products.Commands.Create;
using OrderMS.Application.Features.Products.Commands.Delete;
using OrderMS.Application.Features.Products.Queries;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(ILogger<ProductController> logger) : ApiControllerBase
{
    private readonly ILogger<ProductController> _logger = logger;

    [Authorize(Roles = "Admin, Seller")]
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<Guid>>> Create([FromForm] ProductRequest productRequest)
    {
        return Created(string.Empty, await _sender.Send(new CreateProductCommand(productRequest)));
    }

    [Authorize(Roles = "Admin, Seller")]
    [HttpPut("{id}/update")]
    public async Task<ActionResult<ApiResponse<Guid>>> Update(Guid id, [FromForm] ProductRequest productRequest)
    {
        return Ok(await _sender.Send(new UpdateProductCommand(id, productRequest)));
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

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDetailDto>> GetById(Guid id)
    {
        return Ok(await _sender.Send(new GetProductByIdQuery(id)));
    }

    [Authorize(Roles = "Admin, Seller")]
    [HttpDelete("{id}/delete", Name = "DeleteProducts")]
    public async Task<ActionResult<ApiResponse<string>>> Delete(Guid id)
    {
        return Ok(await _sender.Send(new DeleteProductCommand(id)));
    }
}