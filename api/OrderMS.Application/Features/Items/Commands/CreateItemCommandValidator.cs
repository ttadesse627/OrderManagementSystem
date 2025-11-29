
using FluentValidation;

namespace OrderMS.Application.Features.Items.Commands;

public class CreateItemCommandValidator : AbstractValidator<CreateItemCommand>
{
    public CreateItemCommandValidator()
    {
        RuleFor(x => x.ItemRequest.Name).NotEmpty().WithMessage("Name is required.");
        RuleFor(x => x.ItemRequest.Price).GreaterThanOrEqualTo(1).WithMessage("Price must be at least 1 ETB.");
        RuleFor(x => x.ItemRequest.StockQuantity).GreaterThanOrEqualTo(1).WithMessage("Item stock quantity must be at least 1.");
    }
}