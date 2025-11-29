using MediatR;
using OrderMS.Application.Dtos.Requests;
using OrderMS.Application.Dtos.Responses;
using OrderMS.Application.Services;
using OrderMS.Domain.Entities;

namespace OrderMS.Application.Features.Categories.Commands;

public record CreateCategoryCommand(CategoryRequest CategoryRequest) : IRequest<ApiResponse<Guid>>;
public class CreateCategoryCommandHandler(ICategoryRepository categoryRepository) : IRequestHandler<CreateCategoryCommand, ApiResponse<Guid>>
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;
    public async Task<ApiResponse<Guid>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        ApiResponse<Guid> response = new(Guid.Empty, false);

        if (string.IsNullOrWhiteSpace(request.CategoryRequest.Name))
        {
            throw new ApplicationException("Category Name is required.");
        }
        var category = new Category
        {
            Name = request.CategoryRequest.Name,
            Description = request.CategoryRequest.Description
        };

        _categoryRepository.AddAsync(category);

        int result = await _categoryRepository.SaveChangesAsync(cancellationToken);

        if (result > 0)
        {
            response = new(category.Id, true, "Category created successfully.");
        }

        return await Task.FromResult(response);
    }
}