const schedule = require('node-schedule');
class AppSchedule {
    constructor() {
        schedule.scheduleJob('* * * * * *', this.sayHello);
    }

    sayHello = () => {
        console.log("Hello");
    }
}

module.exports = new AppSchedule();