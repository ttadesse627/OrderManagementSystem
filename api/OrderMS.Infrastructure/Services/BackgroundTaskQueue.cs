using System.Threading.Channels;
using OrderMS.Application.Services;

namespace OrderMS.Infrastructure.Services;

public class BackgroundTaskQueue : IBackgroundTaskQueue
{
    private readonly Channel<Func<CancellationToken, Task>> _queue = Channel.CreateUnbounded<Func<CancellationToken, Task>>();
    public async Task<Func<CancellationToken, Task>> DequeueAsync(CancellationToken cancellationToken)
    {
        return await _queue.Reader.ReadAsync(cancellationToken);
    }

    public void QueueBackgroundTaskItem(Func<CancellationToken, Task> taskItem)
    {
        _queue.Writer.TryWrite(taskItem);
    }
}