<template>
  <v-container>
    <v-row>
      <v-col md="12">
        <v-card id="main-card" outlined>
          <v-card-title class="d-flex justify-center">
            <h2>Dispositivos</h2>
          </v-card-title>
          <v-container>
            <v-row>
              <v-col md="4" v-for="device in devices" :key="device.name">
                <v-card>
                  <v-card-title>
                    {{ device.name }}
                  </v-card-title>
                  <v-card-text>
                    <v-btn
                      class="mx-2"
                      fab
                      large
                      :color="device.status ? '#d3f8d3' : 'white'"
                    >
                      <v-icon large>
                        {{ device.icon }}
                      </v-icon>
                    </v-btn>
                    {{ device.status ? "ativo" : "desligado" }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <!-- <v-col md="6">
        <v-card id="main-card" outlined>
          <v-card-title class="d-flex justify-center">
            <h2>Sensores</h2>
          </v-card-title>
          <v-container>
            <v-row>
              <v-col md="4" v-for="sensor in sensors" :key="sensor.name">
                <v-card>
                  <v-card-title>
                    {{ sensor.name }}
                  </v-card-title>
                  <v-card-text>
                    <v-btn
                      class="mx-2"
                      fab
                      large
                      :color="sensor.color"
                      @click="sensor.status = !sensor.status"
                    >
                      <v-icon large>
                        {{ sensor.icon }}
                      </v-icon>
                    </v-btn>
                    {{
                      sensor.id === 2
                        ? new Date().toLocaleTimeString()
                        : sensor.id === 3 || sensor.id === 4
                        ? "23ºC"
                        : sensor.status
                        ? "Ativo"
                        : "Desligado"
                    }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>
<script>
import config from "../utils/devices_sensors";
export default {
  name: "App",
  data: () => ({
    message: null,
    mqtt: null,
    devices: config.devices,
    sensors: config.sensors,
  }),
  methods: {
    createConnection() {
      try {
        this.mqtt = new Paho.MQTT.Client("maqiatto.com", 8883, "web");
        this.mqtt.connect({
          mqttVersion: 3,
          userName: "hiago23rangel@gmail.com",
          password: "2314",
          onSuccess: this.onConnect,
        });
      } catch (e) {
        console.log(e);
      }
    },
    onConnect() {
      this.mqtt.onMessageArrived = this.onMessageArrived
      this.mqtt.subscribe("hiago23rangel@gmail.com/pbl2");
    },
    onMessageArrived(message) {
      console.log("onMessageArrived:" + message.payloadString);
    },
  },
  created() {
    this.createConnection();
  },
};
</script>
<style>
#main-card {
  width: 100vw;
}
</style>
