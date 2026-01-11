import { addMsg } from "./lib.js";
import { opers, keywords } from "./syntax.js";
// import { tokenize } from "./lexer.js";

self.onmessage = (msg) => {
   const lin = msg.data.lin;

   addMsg(msg.data.lin);
   if (msg.data.done) {
      process.exit();
      return;
   }
   // linAr.push(lin);
   // console.log("this is in synAn: ", msg.data);
   procLine(lin);
};

self.onerror = function (ev) {
   console.log(ev.message);
};

const appenders = new Set(["."]);
const starters = new Set(["<:"]);

function procLine(line) {
   const linAr = line.split("").reverse();
   let lineNum = 0;
   let spaces = "";
   let chunk = "";
   while (linAr.length) {
      let next = linAr.pop();
      if (/^\s+/.test(next)) {
         if (chunk.length) {
            console.log(chunk);
            tokenize(chunk);
            chunk = "";
         }
         continue;
      }
      chunk += next;
      // if (keywords.has(chunk)) {
   }
}

function tokenize(word) {
   // console.log(word);
}

function isAlpha(src) {
   return /[a-zA-Z_$]/.test(src);
}

function isAlphaNum(src) {
   return /[a-zA-Z0-9_$]/.test(src);
}

function isNum(src) {
   return /[0-9]/.test(src);
}

// function c() {
//    return src[itter];
// }
