const { exec } = require('child_process');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sourceHtml = path.resolve(__dirname, 'movement-mindset-guide.html');
const destPdf = path.resolve(__dirname, 'assets', 'movement-mindset-guide.pdf');

// Build the CLI command for Google Chrome to print HTML to PDF
// Flags explanation:
// --headless: Runs Chrome in headless mode (no GUI)
// --disable-gpu: Disables GPU acceleration (often required in headless environments)
// --print-to-pdf: Path to output PDF
// --print-to-pdf-no-header: Disables default page header (title/date) and footer (URL/page numbers)
// --run-all-compositor-stages-before-draw: Ensures all CSS and fonts load before printing
const command = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="${destPdf}" "file://${sourceHtml}"`;

console.log('Compiling PDF from HTML...');
console.log(`Source: ${sourceHtml}`);
console.log(`Destination: ${destPdf}`);
console.log(`Running: ${command}`);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error compiling PDF: ${error.message}`);
        return;
    }
    if (stderr && !stderr.includes('Created dependency') && !stderr.includes('CoreText performance')) {
        console.warn(`Chrome warnings:\n${stderr}`);
    }
    console.log('Success! PDF Guide compiled successfully.');
});
