<template>
  <v-container>
    <v-row>
      <v-col md="6">
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
      <v-col md="6">
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import config from "../utils/mqtt_config";
import mqtt from 'mqtt'
export default {
  name: "App",
  data: () => ({
    devices: [
      {
        name: "Iluminação interna",
        status: true,
        icon: "mdi-lamp-outline",
      },
      {
        name: "Iluminação Garagem",
        status: false,
        icon: "mdi-lamp-outline",
      },
      {
        name: "Iluminação Jardim",
        status: true,
        icon: "mdi-lamp-outline",
      },
      { name: "Sirene", status: false, icon: "mdi-alarm", color: "#ffcccb" },
      {
        name: "Ar Condicionado",
        status: true,
        icon: "mdi-hvac",
      },
    ],
    sensors: [
      {
        id: 0,
        name: "Presença",
        status: false,
        icon: "mdi-account-question-outline",
        color: "white",
      },
      {
        id: 1,
        name: "Abertura",
        status: false,
        icon: "mdi-door-open",
        color: "white",
      },
      {
        id: 2,
        name: "Horário",
        status: false,
        icon: "mdi-clock-outline",
        color: "white",
      },
      {
        id: 3,
        name: "Temperatura Externa",
        status: false,
        icon: "mdi-thermometer",
        color: "white",
      },
      {
        id: 4,
        name: "Temperatura Interna",
        status: false,
        icon: "mdi-thermometer",
        color: "white",
      },
    ],
    client: {
      connected: false,
    },
  }),
  methods: {
    // Create connection
    createConnection() {
      // Connect string, and specify the connection method used through protocol
      // ws unencrypted WebSocket connection
      // wss encrypted WebSocket connection
      // mqtt unencrypted TCP connection
      // mqtts encrypted TCP connection
      // wxs WeChat mini app connection
      // alis Alipay mini app connection
      console.log(config)
      const { host, port, endpoint, ...options } = config.connection;
      const connectUrl = `ws://${host}:${port}${endpoint}`;
      try {
        this.client = mqtt.connect(connectUrl, options);
      } catch (error) {
        console.log("mqtt.connect error", error);
      }
      this.client.on("connect", () => {
        console.log("Connection succeeded!");
      });
      this.client.on("error", (error) => {
        console.log("Connection failed", error);
      });
      this.client.on("message", (topic, message) => {
        this.receiveNews = this.receiveNews.concat(message);
        console.log(`Received message ${message} from topic ${topic}`);
      });
    },
  },
  created () {
    this.createConnection();
  },
};
</script>
<style>
#main-card {
  width: 100vw;
}
</style>
