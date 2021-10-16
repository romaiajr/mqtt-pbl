<template>
  <v-container>
    <v-row>
      <v-col xs="12">
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
                      @click="publish(device)"
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
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "App",
  data: () => ({
    message: null,
    mqtt: null,
    devices: [
      {
        id: 0,
        name: "Iluminação interna",
        status: true,
        icon: "mdi-lamp-outline",
      },
      {
        id: 1,
        name: "Iluminação Garagem",
        status: false,
        icon: "mdi-lamp-outline",
      },
      {
        id: 2,
        name: "Iluminação Jardim",
        status: true,
        icon: "mdi-lamp-outline",
      },
      // { name: "Sirene", status: false, icon: "mdi-alarm", color: "#ffcccb" },
      // {
      //   name: "Ar Condicionado",
      //   status: true,
      //   icon: "mdi-hvac",
      // },
    ],
  }),
  methods: {
    createConnection() {
      try {
        this.mqtt = new Paho.MQTT.Client("maqiatto.com", 8883, "web");
        this.mqtt.connect({
          mqttVersion: 3,
          userName: "romaiajr5@gmail.com",
          password: "7711",
          onSuccess: this.onConnect,
        });
      } catch (e) {
        console.log(e);
      }
    },
    onConnect() {
      this.mqtt.onMessageArrived = this.onMessageArrived;
      this.mqtt.subscribe("romaiajr5@gmail.com/rasp");
    },
    onMessageArrived(message) {
      var res = JSON.parse(message.payloadString);
      console.log(res);
      if (res.event === "OnChangeState") {
        this.setState(res.id, res.data.state);
      }
    },
    //REVIEW
    publish(device) {
      device.status = !device.status;
      var message = new Paho.MQTT.Message(
        JSON.stringify({
          data: { state: device.status },
          event: "onChangeState",
          id: device.id,
        })
      );
      message.destinationName = "romaiajr5@gmail.com/web";
      console.log(JSON.parse(message.payloadString));
      this.mqtt.send(message);
    },
    setState(id, state) {
      this.devices[id].status = state;
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
