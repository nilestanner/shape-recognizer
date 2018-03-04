!function(t){var e={};function n(a){if(e[a])return e[a].exports;var l=e[a]={i:a,l:!1,exports:{}};return t[a].call(l.exports,l,l.exports,n),l.l=!0,l.exports}n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:a})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=4)}([function(t,e){t.exports={distance:(t,e)=>Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)),isVertical:t=>Math.abs(t[0].x-t[t.length-1].x)<Math.abs(t[0].y-t[t.length-1].y),rotate:(t,e,n)=>{const a=Math.cos(n),l=Math.sin(n);return{x:Math.round(a*(e.x-t.x)+l*(e.y-t.y)+t.x),y:Math.round(a*(e.y-t.y)-l*(e.x-t.x)+t.y)}}}},function(t,e,n){const a=n(0);t.exports=(t=>{const e=a.isVertical(t);let n=t;e&&(n=t.map(t=>({x:t.y,y:t.x})));const l=n.map(t=>t.x),o=n.map(t=>t.y);let r=0,i=0,s=0,c=0,u=0,h=0,y=0,p=l.length;if(0===p)return[[],[]];for(let t=0;t<p;t++)r+=h=l[t],i+=y=o[t],c+=h*h,s+=h*y,u++;const x=(u*s-r*i)/(u*c-r*r),d=i/u-x*r/u;let f=0,g=null,P=0;n.forEach(t=>{g&&(P+=a.distance(t,g)),g=t});const M={x:l[0],y:l[0]*x+d},w={x:l[l.length-1],y:l[l.length-1]*x+d},m=a.distance(M,w);let v={accuracy:f=m/P,firstPoint:M,lastPoint:w,angle:Math.atan(x),length:m,fullLength:P};return e&&(v.firstPoint={x:v.firstPoint.y,y:v.firstPoint.x},v.lastPoint={x:v.lastPoint.y,y:v.lastPoint.x},v.angle+=Math.PI/2),v})},function(t,e,n){const a=n(0),l=n(1),o=t=>{let e={x:0,y:0},n="up",a=[],l=[],o="";t[0].x<t[t.length-1].x?o="left":t[0].x>t[t.length-1].x&&(o="right");let r=t.every(t=>{let r;return"left"===o?(r=t.x+1>=e.x,"up"===n&&t.y<e.y?(n="down",t.type="high",a.push(t)):"down"===n&&t.y>e.y&&(n="up",t.type="low",l.push(t))):"right"===o&&(r=t.x-1<=e.x,0===e.x&&(r=!0),"up"===n&&cur.y<e.y?(n="down",t.type="high",a.push(t)):"down"===n&&cur.y>e.y&&(n="up",t.type="low",l.push(t))),e=t,r});const i=t.map(t=>t.y).reduce((t,e)=>t+e,0)/t.length;return a=a.filter(t=>t.y>i),l=l.filter(t=>t.y<i),r&&(l.length<2||a.length<2)&&(r=!1),{criticalPoints:a.concat(l),highPts:a,lowPts:l,valid:r}},r=(t,e)=>{var n=null,a=0;return t.sort((t,e)=>t.x-e.x).forEach(t=>{t.type!==n&&null!==n&&a++,n=pt.type}),a>=e};t.exports=((t,e)=>{void 0===e&&(e=3);let n=l(t);const i=t.map(e=>a.rotate(t[0],e,n.angle)),s=o(i);if(s.valid)if(r(s.criticalPoints,e)){const t=s.highPts.reduce((t,e)=>t+e,0)/s.highPts.length,e=s.lowPts.reduce((t,e)=>t+e,0)/s.lowPts.length;n.amplitude=Math.abs(t-e)/2,n.valid=!0}else n.valid=!1;else n.valid=!1;return n})},function(t,e,n){const a=n(0);t.exports=((t,e)=>{void 0===e&&(e=.5);const n=t.map(t=>t.x),l=Math.max.apply(null,n),o=Math.min.apply(null,n),r=t.map(t=>t.y),i={x:(l+o)/2,y:(Math.max.apply(null,r)+Math.min.apply(null,r))/2},s=t.map(t=>(t.d=a.distance(t,i),t.d)).reduce((t,e)=>t+e,0)/t.length;let c=0,u={d:0},h={d:1/0};return t.forEach(t=>{c+=Math.pow(Math.abs((t.d-s)/s),e),t.d>u.d&&(u=t),t.d<h.d&&(h=t)}),{accuracy:1-(c/=t.length),lowWeakPoint:h,highWeakPoint:u,radius:s,center:i}})},function(t,e,n){const a={analyzeCircle:n(3),analyzeLine:n(1),analyzeSine:n(2)};void 0!==t&&void 0!==t.exports&&(t.exports=a),"undefined"!=typeof window&&(window.analyzer=a),a.analyzeLine([])}]);