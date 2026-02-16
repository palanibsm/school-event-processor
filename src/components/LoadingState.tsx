"use client";

interface LoadingStateProps {
  progress: string;
}

export function LoadingState({ progress }: LoadingStateProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-4">
        <svg
          className="w-5 h-5 text-blue-500 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-sm text-gray-600">{progress}</p>
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-16 h-5 bg-gray-200 rounded-full" />
            <div className="w-40 h-5 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-100 rounded" />
            <div className="w-48 h-4 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
