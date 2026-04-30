// file-reader.js
const fs = require("fs/promises");
const path = require("path");

async function main() {
  const fileName = process.argv[2];

  if (!fileName) {
    console.log("Usage: node file-reader.js <filename>");
  } else {
    try {
      const filePath = path.join(__dirname, fileName);
      const content = await fs.readFile(filePath, "utf-8");
      const fileSize = await fs.stat(fileName);
      const lineCount = content.split("\n").length;
      console.log("File contents:");
      console.log(content);
      console.log("File size in bytes: ", fileSize.size);
      console.log("Number of lines: ", lineCount);
    } catch (err) {
      console.error("Error reading file:", err.message);
    }
  }
}

main();
