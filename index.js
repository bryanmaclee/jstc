import { truncateInput } from "./dep/lib.js";
import { addMsg } from "./dep/lib.js";

const fileReader = new Worker("./dep/fileReader.js");
const syntax = new Worker("./dep/synAn.js");
const lexer = new Worker("./dep/lexicon.js");

lexer.onmessage = function (ev) {
   console.log(ev.data);
};

syntax.onmessage = function (ev) {
   if (ev.data.type === "error") {
      console.error("error from worker: ", ev.data.message);
   }
   // console.log("the val is: ", ev.data.value);
   lexer.postMessage(ev.data);
};

fileReader.onmessage = function (ev) {
   // console.log(ev.data);
   if (ev.data.done) {
      fileReader.postMessage(ev.data);
      syntax.postMessage(ev.data);
   } else {
      syntax.postMessage(ev.data);
   }
};

function getFile(path) {
   fileReader.postMessage({ path: path });
}

async function streamFile(filePath) {
   await fileReader.postMessage("this is a msg");
   // await clearMsgFile();
   const entrance = Bun.file(filePath);
   const stream = entrance.stream();
   const decoder = new TextDecoder();
   let remainder = "";
   let lineNum = 1;

   const file = await Bun.file(filePath).text();
   const src = truncateInput(file);

   addMsg(src);

   let lin = "";
   for (const char of src) {
      if (/\r\n|\r|\n/.test(char)) {
         syntax.postMessage({ lin, done: false });
         lin = "";
      } else {
         lin += char;
      }
   }
   syntax.postMessage({ lin: "", done: true });
   fileReader.postMessage({ done: true });
}

await getFile("./examp/test.s");

fileReader.onerror = function (ev) {
   console.error("worker error ", ev.message);
   console.error("in file: ", ev.filename);
   console.error("line: ", ev.lineno);
};

syntax.onerror = function (ev) {
   console.error("worker error ", ev.message);
   console.error("in file: ", ev.filename);
   console.error("line: ", ev.lineno);
};
// read file by line
// =========================================================
// for await (const chunk of stream) {
//    const str = decoder.decode(chunk, { stream: true });
//    remainder += str;
//    let lines = remainder.split(/\r?\n/);
//
//    while (lines.length > 1) {
//       const line = lines.shift();
//       if (line) {
//          processLine(line, lineNum++);
//       }
//    }
//    remainder = lines[0] || "";
// }
// if (remainder) {
//    addMsg("remainder found at end of file");
// }
// addMsg("file contents read");
// =========================================================
