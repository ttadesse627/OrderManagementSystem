using Microsoft.Extensions.Hosting;


namespace OrderMS.Application.Services;

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
