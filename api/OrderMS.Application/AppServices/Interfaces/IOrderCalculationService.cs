

namespace OrderMS.Application.AppServices.Interfaces;

public interface IOrderCalculationService
{
    decimal CalculateProductSubTotal(decimal price, decimal taxRate, int quantity);
    decimal CalculateOrderGrandTotal(IEnumerable<(decimal price, decimal taxRate, int quantity)> products);
}