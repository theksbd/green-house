class MQTTClient {
  constructor() {
    this.defineField();
    this.client.on("connect", () => {
      this.feeds.forEach((feed) => {
        console.log("Subcribe to feed: " + feed);
        this.client.subscribe(`${this.username}/feeds/${feed}`);
      });
    });
  }

  defineField() {
    this.feeds = ["moisture", "pump"];
    this.mqtt = require("mqtt");
    this.username = process.env.ADAFRUIT_IO_USERNAME;
    this.port = 8883;
    this.key = process.env.ADAFRUIT_IO_KEY;
    this.url = `mqtts://${this.username}:${this.key}@io.adafruit.com`;
    this.client = this.mqtt.connect(this.url, this.port);
  }

  on(event, callback) {
    this.client.on(event, callback);
  }

  subscribe(topic) {
    this.client.subscribe(topic);
  }

  publish(topic, message) {
    this.client.publish(topic, message);
  }
}

module.exports = new MQTTClient();
