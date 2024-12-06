const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors middleware
const pdf = require("html-pdf");

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Root endpoint to check API status
app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/generate-pdf", async (req, res) => {
  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ message: "HTML content is required" });
    }

    const options = {
      height: "1500px", // Set height dynamically based on your content
      width: "1000px", // Match your content's width
      border: {
        top: "10px",
        right: "10px",
        bottom: "10px",
        left: "10px",
      },
    };

    // Generate PDF using html-pdf
    const pdfBuffer = await new Promise((resolve, reject) => {
      pdf.create(htmlContent, options).toBuffer((err, buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(buffer);
      });
    });

    // Set headers for the PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=enhanced_file.pdf"
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      message: "Failed to generate PDF",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
