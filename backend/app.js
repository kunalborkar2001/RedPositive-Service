// app.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cors = require("cors")
const bodyParser = require('body-parser');


const app = express();
app.use(cors())

app.use(bodyParser.json()); 


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/redpositive')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use('/api/data', userRoutes);

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
