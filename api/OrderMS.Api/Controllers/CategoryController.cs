using Microsoft.AspNetCore.Mvc;
using OrderMS.Application.Dtos.Categories.Requests;
using OrderMS.Application.Dtos.Categories.Responses;
using OrderMS.Application.Dtos.Common.Responses;
using OrderMS.Application.Features.Categories.Commands;
using OrderMS.Application.Features.Categories.Queries;

namespace OrderMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ApiControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<Guid>>> Create(CategoryRequest request)
    {
        ApiResponse<Guid> apiResponse = await _sender.Send(new CreateCategoryCommand(request));
        if (apiResponse.Data == Guid.Empty)
        {
            return StatusCode(500, "Operation is not succesful.");
        }
        return CreatedAtAction(nameof(GetById), new { Id = apiResponse.Data }, apiResponse);
    }
    [HttpGet(Name = "Categories")]
    public async Task<ActionResult<List<CategoryDto>>> Get()
    {
        return Ok(await _sender.Send(new GetCategoriesQuery()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetById(Guid id)
    {
        return Ok(await _sender.Send(new GetCategoryByIdQuery(id)));
    }
}