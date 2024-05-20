const mongoose = require('mongoose');
const User = require('../models/userModel');

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
            await User.deleteOne({ studentID: studentID});
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
            const user = await User.findOne({ studentID });
            
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
}


module.exports = userController;