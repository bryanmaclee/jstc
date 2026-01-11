let str = "this is a string";
let a = "";
let b = "";

function sliceIt() {
   const startTime = performance.now();
   for (let i = 0; i < 10000; i++) {
      let it = 1;
      while (it < str.length) {
         a += str.slice(it++);
      }
      // str = "this is a string";
   }
   const runTime = performance.now() - startTime;
   console.log("slicing ", runTime);
   return a;
}

function shiftIt() {
   const startTime = performance.now();
   for (let i = 0; i < 10000; i++) {
      const arStr = str.split();
      let it = 1;
      while (arStr.length) {
         b += arStr.shift();
         it++;
         // console.log("done here");
      }
      // str = "this is a string";
   }
   const runTime = performance.now() - startTime;
   console.log("shifting: ", runTime);
   return b;
}

sliceIt();
shiftIt();
// console.log(shiftIt());
// console.log(sliceIt());
