const mongoose = require('mongoose');
const express = require('express');
const robot = require('robotjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');
const PNG = require('pngjs').PNG;

function isLocationDifferent(storedLocation, currentLocation) {
    const [storedLatitude, storedLongitude] = storedLocation.split(',').map(Number);
    const [currentLatitude, currentLongitude] = currentLocation.split(',').map(Number);
    return storedLatitude !== currentLatitude || storedLongitude !== currentLongitude;
}


const captureScreenshot = (studentID) => {
    try {
        // Capture the screenshot
        const screenSize = robot.getScreenSize();
        const screenshot = robot.screen.capture(0, 0, screenSize.width, screenSize.height);

        // Save the screenshot to a file using pngjs
        const timestamp = Date.now();
        const folderPath = path.join(__dirname, 'screenshots', studentID);
        const screenshotPath = path.join(folderPath, `screenshot_${timestamp}.png`);

        // Create the folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const png = new PNG({
            width: screenshot.width,
            height: screenshot.height,
            inputHasAlpha: true,
        });

        // Convert the screenshot image to PNG format
        for (let y = 0; y < screenshot.height; y++) {
            for (let x = 0; x < screenshot.width; x++) {
                const index = (screenshot.width * y + x) * 4;
                png.data[index] = screenshot.image[index];
                png.data[index + 1] = screenshot.image[index + 1];
                png.data[index + 2] = screenshot.image[index + 2];
                png.data[index + 3] = screenshot.image[index + 3];
            }
        }

        png.pack().pipe(fs.createWriteStream(screenshotPath));

        console.log(`Screenshot captured and saved to ${screenshotPath}`);

        return screenshotPath;
    } catch (error) {
        console.error('Error capturing or saving screenshot:', error);
        return null; // Return null to indicate failure
    }
};



const userController = {
    storeIP: async (req, res) => {
        const originalClientIP = req.body;
        try {
            const user = new User(originalClientIP);
            await user.save();
            res.status(200).json({ message: "Successfully stored" });
        }
        catch (err) {
            console.log('Error : ' + err.message);
            res.status(500).json({ error: "Problem while storing client IP" });
        }
    },
    removeIP: async (req, res) => {
        console.log(req.body);
        const { studentID } = req.body;
        try {
            await User.deleteOne({ studentID: studentID });
            res.status(200).json({ message: "Successfully deleted" });
        }
        catch (err) {
            console.log('Error: ' + err.message);
            res.status(500).json({ error: "Problem while removing client IP" });
        }
    },
    checkLocation: async (req, res) => {
        const { studentID, location } = req.body;
        try {
            const user = await User.findOne({ studentID: studentID });

            if (!user) {
                // console.log(studentID);
                return res.status(404).json({ error: 'User not found' });
            }

            if (isLocationDifferent(user.location, location)) {
                return res.status(302).json({ error: 'Location mismatch' });
            }

            return res.status(200).json({ message: 'Location matches' });
        } catch (error) {
            console.error('Error processing location data:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    storeEvent: async (req, res) => {
        console.log("Call");
        const { studentID, event } = req.body;
        
        try {
            console.log(studentID);
            // console.log("fvfdvdfc");
            const user = await User.findOne({ studentID: studentID })
                .then(res => {
                    if(!res)
                        return res.status(404).json({ error: 'User not found' });
                    return res;
                });
            // if (!req.file) {
            //     return res.status(400).json({ error: 'No file uploaded' });
            // }
            console.log(user);
            console.log("Hello");

            const screenshotPath = captureScreenshot(studentID);
            console.log("After");

            // user.events.push(event);
            // user.screenshots.push(req.file.filename);
            // await user.save();

            return res.status(200).json({ message: 'Event stored' });
        } catch (error) {
            console.error('Error storing event:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}


module.exports = userController;