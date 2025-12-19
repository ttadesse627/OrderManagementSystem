using FluentValidation;


namespace OrderMS.Application.Features.Orders.Commands;

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("Order must contain at least one item.");

        RuleFor(x => x.Items).ForEach(itemsRule =>
        {
            itemsRule.Must(i => !string.IsNullOrWhiteSpace(i.ProductId.ToString())).WithMessage("Product id must not be empty");
            itemsRule.Must(i => i.Quantity > 0).WithMessage("There should be at least one product");
        });
    }
}