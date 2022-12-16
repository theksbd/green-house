const schedule = require('node-schedule');
const axios = require("axios");
const db = require("../config/connectDB")

class AppSchedule {
    constructor() {
        schedule.scheduleJob('0 0 * * * *', this.updateData);
    }

    updateData = async () => {
        var lastHour = new Date();
        lastHour.setHours(lastHour.getHours() - 1);
        lastHour.setMinutes(0, 0, 0);
        var moisture = await this.getData(lastHour, "moisture");
        var temperature = await this.getData(lastHour, "temperature");
        var humid = await this.getData(lastHour, "humid");
        console.log(lastHour.toTimeString());
        console.log(lastHour.toLocaleDateString());

        var query = "INSERT INTO data (garden_id,time,date,temperature,humidity,soil_moisture) VALUES (1,?,?,?,?,?)";
        db.query(query, [lastHour, lastHour, temperature, humid, moisture], (err, rel) => {
            if (err) throw err;
            console.log("Add data of " + lastHour.toLocaleString());
        })
    }

    async getData(lastHour, feed) {
        var end_time = new Date(lastHour.setMinutes(59, 59, 999));
        var start_time = new Date(lastHour.setMinutes(0, 0, 0));
        const response =
            await axios.get("https://io.adafruit.com/api/v2/nhom3cnpm/feeds/" + feed + "/data",
                {
                    params: {
                        "start_time": start_time.toISOString(),
                        "end_time": end_time.toISOString(),
                    }
                }
            );
        var data = await response.data;
        var length = data.length;
        var average = 0;
        if (length > 0) {
            average = (data.reduce((a, b) => a + parseInt(b.value), 0) / length).toFixed(2);
        }
        return average;
    }
}

module.exports = new AppSchedule();