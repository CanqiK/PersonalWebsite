import { GLTFLoader } from '../vendor/GLTFLoader.js';

// The gzip contains the exact original GLB: no geometry, animation or material loss.
// Keep the ordinary loader available for browsers without native decompression.
export async function loadOfficeModel(onProgress) {
  const loader = new GLTFLoader();
  let buffer;
  if (typeof DecompressionStream === 'function') {
    try {
      const response = await fetch('./canqi-night-office.glb.gz?v=loading-58');
      if (!response.ok || !response.body) throw new Error('Compressed office unavailable');
      const total = Number(response.headers.get('content-length'));
      let loaded = 0;
      let stream = response.body.pipeThrough(new TransformStream({
        transform(chunk, controller) {
          loaded += chunk.byteLength;
          onProgress?.({ loaded, total, lengthComputable: total > 0 });
          controller.enqueue(chunk);
        },
      }));
      // Some hosts serve .gz with Content-Encoding and the browser decodes it.
      if (!/\bgzip\b/i.test(response.headers.get('content-encoding') || '')) {
        stream = stream.pipeThrough(new DecompressionStream('gzip'));
      }
      buffer = await new Response(stream).arrayBuffer();
    } catch (error) {
      console.warn('Using the original office model:', error.message);
    }
  }
  if (buffer) return loader.parseAsync(buffer, new URL('./', location.href).href);
  return loader.loadAsync('./canqi-night-office.glb?v=workers-5', onProgress);
}
