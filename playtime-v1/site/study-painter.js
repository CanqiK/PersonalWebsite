/* Shared by the drawing worker and the cooperative fallback. No DOM dependencies. */
globalThis.CanqiStudyPainter = {
  field(x,y,n) {
    let value;
    switch(n%6) {
      case 0:value=.5+.36*Math.sin(x*10+y*3+2*Math.sin(y*9))+.12*Math.cos(y*15);break;
      case 1:value=.54+.29*Math.sin((x+y)*17)+.24*Math.cos(y*8-x*3);if(x>.2&&x<.65&&y>.3&&y<.74)value*=.22;break;
      case 2:value=.45+.32*Math.cos(18*Math.hypot(x-.53,y-.47)-3*Math.atan2(y-.47,x-.53))+.2*Math.sin(11*x+9*y);break;
      case 3:value=.5+.35*Math.sin(7*Math.atan2(y-.47,x-.53)+9*Math.hypot(x-.53,y-.47))+.12*Math.cos(20*y);break;
      case 4:value=.53+.31*Math.cos(13*x+3*Math.sin(y*6))+.2*Math.sin(9*y-2*x);break;
      default:value=.48+.4*Math.sin(12*(x-y)+2*Math.sin(x*8))+.12*Math.cos(y*24);
    }
    return Math.max(.02,Math.min(.98,value+(Math.sin(x*239+y*173+n*7)*43758.5)%1*.035));
  },
  create(canvas,{width,height,n,digital,treatment,dot}) {
    canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext('2d');
    const field=this.field;
    const continuous=treatment==='continuous';
    const pixels=continuous?ctx.createImageData(width,height):null;
    const step=continuous?1:dot*width/360;
    let y=continuous?0:step/2,done=false;
    ctx.fillStyle=digital?'#cccccc':'#e6e4dc';ctx.fillRect(0,0,width,height);
    ctx.fillStyle=digital?'#202020':'#171716';ctx.beginPath();
    return {
      // A fallback yields between rows; the worker can finish the same job in one pass.
      step(deadline=Infinity) {
        if(done)return true;
        do {
          if(continuous) {
            for(let x=0;x<width;x++) {
              const v=field(x/width,y/height,n),p=(y*width+x)*4;
              pixels.data[p]=digital?32+v*172:23+v*207;
              pixels.data[p+1]=digital?32+v*172:23+v*205;
              pixels.data[p+2]=digital?32+v*172:22+v*198;pixels.data[p+3]=255;
            }
          } else {
            const offset=digital&&Math.floor(y/height*29)%11===4?.025:0;
            for(let x=step/2;x<width;x+=step) {
              const shade=1-field(x/width+offset,y/height,n);
              if(digital){const cell=step*Math.sqrt(shade);ctx.rect(x-cell/2,y-cell/2,cell,cell);}
              else{const r=step*.72*Math.sqrt(shade);ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,Math.PI*2);}
            }
          }
          y+=step;
        } while(y<height&&performance.now()<deadline);
        if(y<height)return false;
        if(continuous)ctx.putImageData(pixels,0,0);else ctx.fill();
        done=true;return true;
      }
    };
  }
};
