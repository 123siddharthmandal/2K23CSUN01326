require('dotenv').config();
const express = require('express');
const { Log } = require('./middleware/logger');
const { getOptimalSchedule } = require('./vehicle_scheduling/scheduler');

const app = express();
app.use(express.json());

// Main endpoint to get results in the exact response format
app.get('/api/schedule', async (req, res) => {
    try {
        const results = await getOptimalSchedule();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Check console for logs" });
    }
});

app.listen(3000, async () => {
    console.log("Server listening on port 3000");
    // Mandatory startup log to http://20.207.122.201/evaluation-service/logs
    await Log("backend", "info", "config", "Maintenance Scheduler Microservice successfully initialized.");
});