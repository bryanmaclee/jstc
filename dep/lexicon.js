let context = null;
let prev = null;
const phrase = [];

self.onmessage = function (msg) {
   const dat = msg.data;
   const type = dat.type;
   const kind = dat.kind;

   if (type === "format") {
      if (kind === "new_line") {
         // console.log("new line: ", dat);
      } else {
         // console.log("a space: ", dat);
      }
   } else {
      buildPhrase(dat);
   }
};

function buildPhrase(token) {
   console.log(token);
   phrase.push(token);
}
