


using System.Text.Json;
using OrderMS.Application.AppServices.Interfaces;
using OrderMS.Application.Dtos.Products.Responses;

namespace OrderMS.Application.AppServices.Services;

public class ClientService(ProductsClient productsClient) : IClientService
{
    // private readonly IHttpClientFactory _clientFactory = clientFactory;
    // private readonly JsonSerializerOptions _serializerOptions = new() { PropertyNameCaseInsensitive = true };
    private readonly ProductsClient _productsClient = productsClient;

    public async Task<List<ProductResponse>> WarehouseProducts()
    {
        return await _productsClient.GetProductsAsync();
    }

    // private async Task<List<ProductResponse>> GetProductsAsync()
    // {
    //     HttpClient httpClient = _clientFactory.CreateClient("ProductsClient");

    //     using var response = await httpClient.GetAsync("products",
    //             HttpCompletionOption.ResponseHeadersRead);
    //     response.EnsureSuccessStatusCode();
    //     var stream = await response.Content.ReadAsStreamAsync();
    //     var deserializedResponse = await JsonSerializer.DeserializeAsync<List<ProductResponse>>(stream, _serializerOptions);

    //     return deserializedResponse ?? [];
    // }
}