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
      this.username = "nhom3cnpm";
      this.port = 8883;
      this.key = "aio_XlEE731ZNtANU0rlqCV14J26i9JN";
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
  