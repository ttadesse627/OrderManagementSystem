

namespace OrderMS.Application.Dtos.Responses;

public record ApiResponse<T>(T? Data, bool Success = false, string? Message = null);