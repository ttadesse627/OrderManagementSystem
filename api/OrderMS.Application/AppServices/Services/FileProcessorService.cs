using Microsoft.Extensions.Hosting;
using OrderMS.Application.AppServices.Interfaces;


namespace OrderMS.Application.AppServices.Services;

public class FileProcessorService(IBackgroundTaskQueue taskQueue) : BackgroundService
{
    private readonly IBackgroundTaskQueue _taskQueue = taskQueue;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var taskItem = await _taskQueue.DequeueAsync(stoppingToken);
            await taskItem(stoppingToken);
        }
    }
}
