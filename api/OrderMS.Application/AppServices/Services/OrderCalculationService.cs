using OrderMS.Application.AppServices.Interfaces;


namespace OrderMS.Application.AppServices.Services;

public class OrderCalculationService : IOrderCalculationService
{
    public decimal CalculateProductSubTotal(decimal price, decimal taxRate, int quantity)
    {
        var taxAmount = price * taxRate;
        var subTotal = (price + taxAmount) * quantity;

        return decimal.Round(subTotal, 2, MidpointRounding.AwayFromZero);
    }
    public decimal CalculateOrderGrandTotal(IEnumerable<(decimal price, decimal taxRate, int quantity)> products)
    {
        decimal grandTotal = 0;

        foreach (var (price, taxRate, quantity) in products)
        {
            grandTotal += CalculateProductSubTotal(price, taxRate, quantity);
        }

        return decimal.Round(grandTotal, 2, MidpointRounding.AwayFromZero);
    }
}