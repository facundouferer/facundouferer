declare module '@vercel/blob' {
  // Minimal typings to satisfy TS without pulling full types
  export type PutInput = ArrayBuffer | Uint8Array | Buffer | Blob | File | ReadableStream<unknown>;
  export interface PutOptions {
    access?: 'public' | 'private';
    token?: string;
    contentType?: string;
  }
  export function put(name: string, data: PutInput, options?: PutOptions): Promise<{ url: string }>;
}
