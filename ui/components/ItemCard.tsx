type ItemCardProps = {
  id: string;
  name: string;
  price: number;
  imageSrc?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
};

export default function ItemCard({
  id,
  name,
  price,
  imageSrc = "/next.svg",
  description,
  onAction,
  actionLabel = "View",
}: ItemCardProps) {
  return (
    <div
      className="group rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition dark:border-zinc-800 dark:bg-zinc-950"
      data-id={id}
    >
      <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-900">
        <img src={imageSrc} alt={name} className="h-12 w-auto opacity-80" />
      </div>
      <div className="space-y-1">
        <h2 className="text-sm font-medium">{name}</h2>
        {description ? (
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold">${" "}{price.toFixed(2)}</span>
        <button
          className="rounded-md bg-zinc-900 px-3 py-2 text-xs text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          aria-label={`Action: ${name}`}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

