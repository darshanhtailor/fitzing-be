const axios = require('axios');
const cheerio = require('cheerio');

async function getFoodImage(url) {
  try {
    // Fetch HTML content of the URL
    const response = await axios.get(url);
    // Load HTML content into Cheerio
    const $ = cheerio.load(response.data);
    
    // Find the image with class name "food-image"
    const imageSrc = $('.recipe-image>img').attr('src');
    
    if (imageSrc) {
      return imageSrc;
    } else {
      throw new Error('Image with class name "food-image" not found.');
    }
  } catch (error) {
    console.error('Error fetching image source:', error);
    return null;
  }
}

module.exports = getFoodImage;