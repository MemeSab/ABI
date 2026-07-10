const { exec } = require('child_process');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const buildConfigs = [
    {
        source: 'movement-mindset-guide.html',
        dest: path.resolve(__dirname, 'assets', 'movement-mindset-guide.pdf')
    },
    {
        source: 'daily-habits-tracker.html',
        dest: path.resolve(__dirname, 'assets', 'daily-habits-tracker.pdf')
    }
];

console.log('Starting PDF compilation...');

buildConfigs.forEach((config) => {
    const sourceHtml = path.resolve(__dirname, config.source);
    const destPdf = config.dest;
    
    // Command flags:
    // --headless: Runs Chrome in headless mode (no GUI)
    // --disable-gpu: Disables GPU acceleration (often required in headless environments)
    // --print-to-pdf: Path to output PDF
    // --print-to-pdf-no-header: Disables default page header/footer
    // --run-all-compositor-stages-before-draw: Ensures all CSS and fonts load before printing
    const command = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="${destPdf}" "file://${sourceHtml}"`;

    console.log(`Compiling: ${config.source} -> ${path.basename(destPdf)}`);
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error compiling ${config.source}: ${error.message}`);
            return;
        }
        console.log(`Success! Compiled ${config.source} to ${path.basename(destPdf)}`);
    });
});
