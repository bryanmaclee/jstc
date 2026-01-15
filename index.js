import { truncateInput } from "./dep/lib.js";
import { addMsg } from "./dep/lib.js";
const str = "word word word";
const reg = str.match(/^word/);
// console.log(reg);
const fileReader = new Worker("./dep/fileReader.js");
const syntax = new Worker("./dep/synAn.js");
syntax.onerror = function (ev) {
   console.error("worker error ", ev.message);
   console.error("in file: ", ev.filename);
   console.error("line: ", ev.lineno);
};

syntax.onmessage = function (ev) {
   if (ev.data.type === "error") {
      console.error("error from worker: ", ev.data.message);
   }
};

fileReader.onerror = function (ev) {
   console.error("worker error ", ev.message);
   console.error("in file: ", ev.filename);
   console.error("line: ", ev.lineno);
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
