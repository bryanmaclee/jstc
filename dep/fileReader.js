import { truncateInput } from "./lib.js";
import { addMsg } from "./lib.js";

self.onmessage = (msg) => {
   // console.log(msg);
   if (msg.data.done) {
      process.exit();
      return;
   } else if (msg.data.path) {
      console.log(msg.data.path);
      readIn(msg.data.path);
   }
};

self.onerror = function (ev) {
   console.log(ev.message);
};

async function readIn(filePath) {
   // console.log("made it");
   await clearMsgFile();
   let remainder = "";
   let lineNum = 1;

   const file = await Bun.file(filePath).text();
   const src = truncateInput(file);

   // addMsg(src);

   let lin = "";
   for (const char of src) {
      if (/\r\n|\r|\n/.test(char)) {
         self.postMessage({ lin, done: false });
         lin = "";
      } else {
         lin += char;
      }
   }
   self.postMessage({ lin: "", done: true });
   // process.exit();
}

async function clearMsgFile() {
   await Bun.write("messages.txt", "");
}
