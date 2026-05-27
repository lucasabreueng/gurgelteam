import type { ImportPreviewData, PipelineProgress } from "../types";
import { processCsvFile, processCsvText, type ProcessOptions } from "./pipeline";

type QueueJob = {
  id: string;
  run: () => Promise<ImportPreviewData>;
  onProgress?: (p: PipelineProgress) => void;
  resolve: (data: ImportPreviewData) => void;
  reject: (err: Error) => void;
};

class TelemetryProcessingQueue {
  private queue: QueueJob[] = [];
  private running = false;

  enqueueCsvFile(
    file: File,
    options: Omit<ProcessOptions, "sourceFileName"> & { sourceFileName?: string },
  ): Promise<ImportPreviewData> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id: crypto.randomUUID(),
        run: () => processCsvFile(file, options),
        onProgress: options.onProgress,
        resolve,
        reject,
      });
      void this.drain();
    });
  }

  enqueueCsvText(
    text: string,
    options: ProcessOptions,
  ): Promise<ImportPreviewData> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id: crypto.randomUUID(),
        run: () => processCsvText(text, options),
        onProgress: options.onProgress,
        resolve,
        reject,
      });
      void this.drain();
    });
  }

  private async drain(): Promise<void> {
    if (this.running) return;
    this.running = true;
    while (this.queue.length > 0) {
      const job = this.queue.shift()!;
      try {
        const result = await job.run();
        job.resolve(result);
      } catch (err) {
        job.reject(err instanceof Error ? err : new Error(String(err)));
      }
    }
    this.running = false;
  }
}

export const telemetryQueue = new TelemetryProcessingQueue();
