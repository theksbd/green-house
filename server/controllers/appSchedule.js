const schedule = require("node-schedule");
class AppSchedule {
  constructor() {
    schedule.scheduleJob("1 0 0 * * *", this.sayHello);
  }

  sayHello = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    console.log(`Hello at ${day}/${month}/${year} ${hour}:${minute}:${second}`);
  };
}

module.exports = new AppSchedule();
