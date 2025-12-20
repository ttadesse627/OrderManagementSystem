

using OrderMS.Domain.Utilities.Enums;

namespace OrderMS.Domain.Utilities;

public record ValidationResult(bool Success, string? ErrorMessage, Severity? Severity);