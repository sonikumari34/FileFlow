const express = require("express");
const app = express();

const PORT = process.env.PORT || 9000;
const path = require('path');
app.use(express.static('public'));

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

//template engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));


// Routes
// Enable JSON parsing middleware
app.use(express.json());

// API Routes
app.use("/api/files", require("./routes/files"));
app.use('/files', require('./routes/show'));
//app.use('/files/download', require('./routes/download'));

// Uncomment these routes if you need them in the future
// app.use("/files", require("./routes/show"));
// app.use("/files/download", require("./routes/download"));

// Root route for checking server status
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Added space here for proper log message
});

