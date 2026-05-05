const axios = require('axios');

/**
 * Exact implementation based on image_0e2ae0.png and image_0444b8.png
 */
const Log = async (stack, level, pkg, message) => {
    // The exact endpoint from image_0444b8.png
    const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";
    
    // Formatting payload according to image_0e2abb.png
    const payload = {
        stack: stack.toLowerCase(),    // Must be "backend" or "frontend"
        level: level.toLowerCase(),    // Must be "debug", "info", "warn", "error", or "fatal"
        package: pkg.toLowerCase(),    // e.g., "controller", "db", "config"
        message: message               // Descriptive narrative
    };

    try {
        const response = await axios.post(LOG_API_URL, payload, {
            headers: {
                // Must use the Bearer token found in image_02e05b.png
                'Authorization': `Bearer ${process.env.API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Exact response format expected: { logID, message }
        console.log(`Log Created: ${response.data.logID}`);
        return response.data;
    } catch (error) {
        console.error("Log API Error:", error.response ? error.response.data : error.message);
    }
};

module.exports = { Log };