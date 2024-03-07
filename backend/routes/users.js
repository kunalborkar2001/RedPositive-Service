// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a new user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Retrieve all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Retrieve a specific user
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a specific user
router.put('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Ensure ID is in correct format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields if present in the request body
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.phoneNumber) {
            user.phoneNumber = req.body.phoneNumber;
        }
        if (req.body.hobbies) {
            user.hobbies = req.body.hobbies;
        }

        // Save the updated user
        const updatedUser = await user.save();

        return res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});





// Delete a specific user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/send-email', async (req, res) => {
    const data = JSON.parse(req.body.text);

    // Constructing the email body
    let emailBody = 'Data:\n\n';
    data.forEach((item, index) => {
        emailBody += `Item ${index + 1}:\n`;
        emailBody += `Name: ${item.name}\n`;
        emailBody += `Phone Number: ${item.phoneNumber}\n`;
        emailBody += `Email: ${item.email}\n`;
        emailBody += `Hobbies: ${item.hobbies}\n\n`;
    });


    try {
        // Create a transporter object using SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kunalborkar3088@gmail.com', 
                pass: process.env.PASSWORD
            }
        });

        // Email options
        let mailOptions = {
            from: 'kunalborkar3088@gmail.com', // sender address
            to: "info@redpositive.in", // list of receivers
            subject: "Data", 
            text: emailBody
        };

        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
