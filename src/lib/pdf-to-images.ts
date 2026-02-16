const TARGET_WIDTH = 1536;

export async function renderPdfToImages(
  pdfData: ArrayBuffer
): Promise<string[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  const numPages = pdf.numPages;
  const images: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const scale = TARGET_WIDTH / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    const context = canvas.getContext("2d")!;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvas,
      canvasContext: context,
      viewport: scaledViewport,
    }).promise;

    // Use JPEG at 0.85 quality to keep payload under Vercel's 4.5MB limit
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    images.push(dataUrl);

    page.cleanup();
  }

  return images;
}
