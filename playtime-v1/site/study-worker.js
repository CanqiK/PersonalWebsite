importScripts('study-painter.js?v=performance-29');
self.onmessage=({data})=>{
  try {
    const canvas=new OffscreenCanvas(data.spec.width,data.spec.height);
    CanqiStudyPainter.create(canvas,data.spec).step();
    const bitmap=canvas.transferToImageBitmap();
    self.postMessage({id:data.id,bitmap},[bitmap]);
  } catch(error) { self.postMessage({id:data.id,error:String(error)}); }
};
