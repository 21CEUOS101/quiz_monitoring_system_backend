
const robot = require('robotjs');
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

// Function to format timestamp to a readable format
function getFormattedTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

const captureScreenshot = (studentID) => {
    try {
        const screenSize = robot.getScreenSize();
        const screenshot = robot.screen.capture(0, 0, screenSize.width, screenSize.height);

        const timestamp = getFormattedTimestamp();
        const folderPath = path.join(__dirname, 'screenshots', studentID);
        const screenshotPath = path.join(folderPath, `screenshot_${timestamp}.png`);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const png = new PNG({
            width: screenshot.width,
            height: screenshot.height,
            inputHasAlpha: true,
        });

        for (let y = 0; y < screenshot.height; y++) {
            for (let x = 0; x < screenshot.width; x++) {
                const index = (screenshot.width * y + x) * 4;
                png.data[index] = screenshot.image[index];
                png.data[index + 1] = screenshot.image[index + 1];
                png.data[index + 2] = screenshot.image[index + 2];
                png.data[index + 3] = screenshot.image[index + 3];
            }
        }

        const buffer = PNG.sync.write(png);
        fs.writeFileSync(screenshotPath, buffer);

        console.log(`Screenshot captured and saved to ${screenshotPath}`);

        return { buffer, screenshotPath };
    } catch (error) {
        console.error('Error capturing or saving screenshot:', error);
        return null; // Return null to indicate failure
    }
};

module.exports = { captureScreenshot };