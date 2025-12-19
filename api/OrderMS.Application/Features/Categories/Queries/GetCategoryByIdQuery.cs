using FluentValidation;
using MediatR;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Categories.Responses;

namespace OrderMS.Application.Features.Categories.Queries;

public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryDto>;
public class GetCategoryByIdQueryHandler(ICategoryRepository categoryRepository) : IRequestHandler<GetCategoryByIdQuery, CategoryDto>
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;
    public async Task<CategoryDto> Handle(GetCategoryByIdQuery query, CancellationToken cancellationToken)
    {
        var category = (query.Id != Guid.Empty ? await _categoryRepository.GetByIdAsync(query.Id)
                    : throw new ValidationException($"{nameof(query.Id)} is not provided.")) ??
                throw new KeyNotFoundException("Requested item does not found");

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };

    }
}