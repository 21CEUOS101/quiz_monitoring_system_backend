const mongoose = require('mongoose');
const express = require('express');
const robot = require('robotjs');
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const { captureScreenshot } = require('./utils');
const User = require('../models/userModel');
const Audio = require('../models/Audio');

function isLocationDifferent(storedLocation, currentLocation) {
    const [storedLatitude, storedLongitude] = storedLocation.split(',').map(Number);
    const [currentLatitude, currentLongitude] = currentLocation.split(',').map(Number);
    return storedLatitude !== currentLatitude || storedLongitude !== currentLongitude;
}

const userController = {
    storeIP: async (req, res) => {
        const originalClientIP = req.body;
        try {
            const user = new User(originalClientIP);
            await user.save();
            res.status(200).json({ message: "Successfully stored" });
        } catch (err) {
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
        } catch (err) {
            console.log('Error: ' + err.message);
            res.status(500).json({ error: "Problem while removing client IP" });
        }
    },
    checkLocation: async (req, res) => {
        const { studentID, location } = req.body;
        try {
            const user = await User.findOne({ studentID: studentID });

            if (!user) {
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
        const { studentID, event } = req.body;
        console.log(req.body.event);
        try {
            const user = await User.findOne({ studentID: studentID });
            // console.log(user);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const screenshotData = captureScreenshot(studentID);
            if (!screenshotData) {
                return res.status(500).json({ error: 'Failed to capture screenshot' });
            }

            user.events.push(event);
            user.screenshots.push({
                data: screenshotData.buffer,
                contentType: 'image/png',
                filePath: screenshotData.screenshotPath
            });
            await user.save();

            console.log(`Event stored for user ${studentID}`);
            return res.status(200).json({ message: 'Event stored' });
        } catch (error) {
            console.error('Error storing event:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    storeAudio: async (req, res) => {
        const { studentID, audio } = req.body;
        console.log(req.body.audio);
        try {
            const audioBuffer = Buffer.from(audio, 'base64');
            const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
            const folderPath = path.join(__dirname, 'audio', studentID);
            const audioPath = path.join(folderPath, `audio_${timestamp}.wav`);
    
            // Ensure the directory exists
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
    
            // Write the audio file
            fs.writeFileSync(audioPath, audioBuffer);
    
            return res.status(200).json({ message: 'Audio stored', path: audioPath });
    
        } catch (error) {
            console.error('Error storing audio:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
};

module.exports = userController;
