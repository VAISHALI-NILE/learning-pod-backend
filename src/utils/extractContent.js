const pdfParse = require("pdf-parse");
const textract = require("textract");

// Function to extract content from different file types
const extractFileContent = async (file) => {
  try {
    if (file.mimetype === "application/pdf") {
      // Extract content from PDF files
      const dataBuffer = file.buffer;
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Extract content from DOCX files
      return new Promise((resolve, reject) => {
        textract.fromBufferWithMime(
          file.mimetype,
          file.buffer,
          (error, text) => {
            if (error) {
              reject(error);
            } else {
              resolve(text);
            }
          }
        );
      });
    } else if (file.mimetype === "text/plain") {
      // Extract content from TXT files
      return file.buffer.toString();
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error extracting file content:", error.message);
    throw new Error("Failed to extract file content");
  }
};

module.exports = { extractFileContent };
