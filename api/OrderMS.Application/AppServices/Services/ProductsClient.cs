

using System.Text.Json;
using OrderMS.Application.Dtos.Products.Responses;

namespace OrderMS.Application.AppServices.Services;

public class ProductsClient(HttpClient httpClient)
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly JsonSerializerOptions _options = new() { PropertyNameCaseInsensitive = true };

    public async Task<List<ProductResponse>> GetProductsAsync()
    {
        using var response = await _httpClient.GetAsync("products",
                HttpCompletionOption.ResponseHeadersRead);
        response.EnsureSuccessStatusCode();
        var stream = await response.Content.ReadAsStreamAsync();
        var deserializedResponse = await JsonSerializer.DeserializeAsync<List<ProductResponse>>(stream, _options);

        return deserializedResponse ?? [];
    }
}