const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const CLOUD_NAME = 'dnzr6bi1a'
const API_KEY = "828674762569946";
const API_SECRET = "Oi-kYw5UhZpzz1ReZ9eNdoXrkIw";

// Cloudinary config
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'recipeImg',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});


exports.upload = multer({ storage });
