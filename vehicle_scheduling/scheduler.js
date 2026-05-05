const axios = require('axios');
const { Log } = require('../middleware/logger');

const getOptimalSchedule = async () => {
    const config = { headers: { 'Authorization': `Bearer ${process.env.API_TOKEN}` } };
    const BASE = "http://20.207.122.201/evaluation-service";

    try {
        // Fetching data from routes in image_03d3be.png and image_03d39e.png
        const [depotRes, vehicleRes] = await Promise.all([
            axios.get(`${BASE}/depots`, config),
            axios.get(`${BASE}/vehicles`, config)
        ]);

        const depots = depotRes.data.depots;
        const tasks = vehicleRes.data.vehicles;

        return depots.map(depot => {
            // Optimization logic to maximize impact within MechanicHours
            const result = optimize(tasks, depot.MechanicHours);
            
            // Strategic logging call to the required endpoint
            Log("backend", "info", "controller", `Scheduled Depot ${depot.ID}: ${result.totalImpact} impact.`);
            
            return {
                depotID: depot.ID,
                maxImpact: result.totalImpact,
                selectedTasks: result.taskIDs
            };
        });
    } catch (error) {
        await Log("backend", "error", "handler", "Critical data fetch failure");
        throw error;
    }
};

// Greedy approach to maximize operational impact
function optimize(tasks, budget) {
    const sorted = [...tasks].sort((a, b) => (b.Impact / b.Duration) - (a.Impact / a.Duration));
    let currentHours = 0, totalImpact = 0, taskIDs = [];

    for (const t of sorted) {
        if (currentHours + t.Duration <= budget) {
            currentHours += t.Duration;
            totalImpact += t.Impact;
            taskIDs.push(t.TaskID);
        }
    }
    return { totalImpact, taskIDs };
}

module.exports = { getOptimalSchedule };