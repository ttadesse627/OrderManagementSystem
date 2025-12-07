
using FluentValidation;

namespace OrderMS.Application.Features.Products.Commands.Create;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.ProductRequest.Name).NotEmpty().WithMessage("Name is required.");
        RuleFor(x => x.ProductRequest.Price).GreaterThanOrEqualTo(1).WithMessage("Price must be at least 1 ETB.");
        RuleFor(x => x.ProductRequest.StockQuantity).GreaterThanOrEqualTo(1).WithMessage("Product stock quantity must be at least 1.");
    }
}