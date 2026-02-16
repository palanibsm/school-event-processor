"use client";

interface PdfPreviewProps {
  images: string[];
  fileName: string;
}

export function PdfPreview({ images, fileName }: PdfPreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">
          {fileName}
        </p>
        <p className="text-xs text-gray-500">
          {images.length} page{images.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="shrink-0 w-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
          >
            <img
              src={img}
              alt={`Page ${i + 1}`}
              className="w-full h-auto"
            />
            <p className="text-xs text-center text-gray-500 py-0.5">
              {i + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
