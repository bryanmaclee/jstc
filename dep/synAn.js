import { addMsg } from "./lib.js";
import { opers, keywords } from "./syntax.js";
// import { tokenize } from "./lexer.js";

self.onmessage = (msg) => {
   const lin = msg.data.lin;
   const linNum =
      msg.data.num < 10
         ? `  ${msg.data.num}`
         : msg.data.num < 100
           ? ` ${msg.data.num}`
           : msg.data.num;
   if (linNum) {
      addMsg(`${linNum}: ${lin}`);
   }
   if (msg.data.done) {
      process.exit();
      return;
   }
   procLine(lin);
};

self.onerror = function (ev) {
   console.log(ev.message);
};

const appenders = new Set(["."]);
const starters = new Set(["<:"]);
const tokens = [];

function procLine(lin) {
   const src = lin.split("").reverse();
   let lineNum = 0;
   let spaces = "";
   let chunk = "";
   let cursor = 0;
   let itter = 0;
   let char = 1;
   let line = 1;
   let tokenNumber = 0;
   let lineStartPos = 1;

   function step() {
      cursor++;
      return src.pop();
   }

   function c() {
      return src[itter];
   }

   function inc() {
      char++;
      itter++;
   }

   function isKeyword(word) {
      return keywords.has(word);
   }

   function skippable(str) {
      if (str === " " || str === "\t") {
         return "s";
      } else if (str === "\n" || str === "\r") {
         return "l";
      }
      return false;
   }

   function add(value, type, kind, addTok = true) {
      tokens.push({
         value,
         length: value.length,
         type,
         kind,
         position: itter - value.length + 1,
         line: line,
         start_col: char - value.length,
         end_col: char - 1,
         token_num: addTok ? ++tokenNumber : null,
      });
   }

   while (itter < src.length) {
      let chunk = "";
      let usefullVar;
      chunk += c();
      if (isNum(chunk)) {
         inc();
         while (itter < src.length && (isNum(c()) || c() === ".")) {
            chunk += c();
            inc();
         }
         add(chunk, "number", "numeric_lit");
         continue;
      } else if (isAlpha(c())) {
         inc();
         while (itter < src.length && isAlphaNum(c())) {
            chunk += c();
            inc();
         }
         if (isKeyword(chunk)) {
            add(chunk, "word", "keyword");
         } else {
            add(chunk, "word", "identifier");
         }
         continue;
      } else if ((usefullVar = skippable(chunk))) {
         inc();
         if (usefullVar === "l") {
            char = 1;
            add(chunk, "format", "new_line");
            lineStartPos = itter;
            line++;
         } else {
            add(chunk, "format", "white_space");
         }
         continue;
      } else if (opers.has(chunk)) {
         inc();
         if (chunk === '"' || chunk === "'") {
            let quoteType = chunk;
            while (c() !== quoteType) {
               chunk += c();
               inc();
            }
            chunk += c();
            inc();
            add(chunk, "string", "literal");
            continue;
         }
         while (itter < src.length && opers.has(chunk + c())) {
            chunk += c();
            inc();
         }
         add(chunk, "operator", opers.get(chunk));
         continue;
      }
      console.error(
         `Lexer Error:\nunrecognized character: "${chunk}" found in source at line ${line} char ${
            char - chunk.length
         } position: ${itter}`,
      );
      // return tokens;
      console.log(tokens);
   }
   add("EOF", "EOF", "EOF");
   // return tokens;
}

// while (linAr.length) {
//    let next = step();
//    while (/^\s/.test(next)) {
//       next = step();
//    }
//    chunk += next;
//    if (isNum(chunk)) {
//       console.log(chunk);
//    }

// if (isNum(
// switch (true) {
//    case next === ";":
//    case /\r\n|\r|\n/.test(next):
//    case /^\s+/.test(next):
//       if (chunk.length) {
//          tokenize(chunk, cursor);
//          chunk = "";
//       }
//       break;
//    case opers.has(next):
//       tokenize(next);
//       break;
//    case opers.has(chunk):
//       tokenize(chunk);
//       break;
// }
// chunk += next;
// if (keywords.has(chunk)) {
//    }
// }

function tokenize(word, cur) {
   console.log("in tok: ", word);
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
