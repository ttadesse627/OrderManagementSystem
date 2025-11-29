using MediatR;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Services;

namespace OrderMS.Application.Features.Categories.Queries;

public record GetCategoriesQuery : IRequest<List<CategoryDto>>;
public class GetCategoriesQueryHandler(ICategoryRepository categoryRepository) : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;
    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllAsync();
        var responseCategories = categories.Select(cat =>
        {
            return new CategoryDto { Id = cat.Id, Name = cat.Name, Description = cat.Description };
        });

        return [.. responseCategories];
    }
}