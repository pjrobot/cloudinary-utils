require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to fetch image details
async function listImages(folderPath = "") {
  try {
    const result = await cloudinary.api.resources({
      resource_type: "image", // Fetch only images
      type: "upload", // Only uploaded images
      prefix: folderPath, // Folder path to search within (empty string lists all images)
      max_results: 500, // Number of images to fetch per request (max 500)
    });

    console.log(result.resources[0]);

    const sortedResources = result.resources.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    // Extract public ID, width, and height from each image
    const imageDetails = sortedResources.map((image) => ({
      src: image.public_id,
      width: image.width,
      height: image.height,
      alt: "",
    }));

    console.log(JSON.stringify(imageDetails, null, 2));
  } catch (error) {
    console.error("Error fetching image details:", error);
  }
}

// Get folder path from the command-line arguments (optional)
const folder = process.argv[2] || ""; // Default to empty string if no folder is provided

// Execute the function
listImages(folder);
