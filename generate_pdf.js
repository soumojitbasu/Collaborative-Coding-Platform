const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const htmlPath = path.resolve(__dirname, "resume.html");
const pdfPath = path.resolve(__dirname, "Soumojit_Basu_Resume.pdf");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

console.log("Generating PDF from:", htmlPath);
console.log("Output destination:", pdfPath);

try {
    execFileSync(edgePath, [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        `--print-to-pdf=${pdfPath}`,
        `file:///${htmlPath.replace(/\\/g, "/")}`
    ], { stdio: "inherit" });

    if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        console.log(`✅ Successfully generated ${pdfPath} (${stats.size} bytes)`);
    } else {
        console.error("❌ PDF was not found at target path.");
    }
} catch (err) {
    console.error("Error generating PDF:", err);
}
