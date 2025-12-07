"use client";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose(): void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-6 shadow-xl min-w-[350px] animate-fadeIn"
      >
        {children}
      </div>
    </div>
  );
}