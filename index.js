var express = require('express');
var cors = require('cors');
const multer = require('multer');
require('dotenv').config();

var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use('/public', express.static(process.cwd() + '/public'));

// Serve the HTML page
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Configure Multer storage to store file in memory
const storage = multer.memoryStorage();  
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }  // Limit file size to 10 MB
});

// File upload route
app.post("/api/fileanalyse", upload.single('upfile'), (req, res) => {
  const file = req.file;

  // Check if file is provided
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Get file details
  const filename = file.originalname;
  const filetype = file.mimetype;
  const filesize = file.size;

  // Send JSON response with file details
  res.json({
    name: filename,
    type: filetype,
    size: filesize
  });
});

// Set up the server to listen on a port
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
