<template>
  <v-container class="d-flex justify-center align-center">
    <v-card id="main-card" outlined>
      <v-card-title class="d-flex justify-center">
        <h2>Dispositivos</h2>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              sm="5"
              offset-sm="1"
              :style="{ borderRight: '.5px solid rgba(0,0,0,.12)' }"
            >
              <div v-for="device in devices" :key="device.id">
                <v-switch
                  v-model="device.status"
                  :label="device.name"
                  @change="changeState(device)"
                />
                <div v-if="device.id === 4">
                  <h4>
                    Temp. Atual: {{ device.temp_atual }}ºC <br />
                    Faixa de operação: <br />Temp. Mínima: {{ device.min }}ºC
                    <br />
                    Temp. Máxima: {{ device.max }}ºC
                  </h4>
                </div>
              </div>
            </v-col>
            <v-col sm="6">
              <div id="luz">
                <h4>Horário de funcionamento das luzes internas:</h4>
                Horário inicial:
                <input type="time" class="mt-1" v-model="form_luz.time_start" />
                Horário Final:
                <input type="time" v-model="form_luz.time_end" />
                <br />
                <v-btn
                  depressed
                  color="primary"
                  small
                  class="mt-2"
                  block
                  @click="submit(1)"
                  :disabled="isDisabled"
                  >Confirmar</v-btn
                >
              </div>
              <br />
              <v-divider />
              <div id="ac">
                <h4>Faixa de Operação do Ar Condicionado:</h4>
                <div class="mt-1">
                  Temp. Mínima:
                  <v-slider
                    max="32"
                    min="16"
                    v-model="form_temp.min"
                    thumb-label
                    dense
                  ></v-slider>
                  Temp. Máxima:
                  <v-slider
                    max="32"
                    :min="form_temp.min + 1"
                    thumb-label
                    v-model="form_temp.max"
                    dense
                  ></v-slider>
                </div>
                <v-btn depressed color="primary" small block @click="submit(2)"
                  >Confirmar</v-btn
                >
              </div>
              <br />
              <v-divider />
              <div v-if="sirene.status">
                <v-alert dense outlined type="error">
                  <b>Invasão ocorrendo:</b> {{ sirene.motivo }}
                </v-alert>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <div class="text-center" v-if="isLoading" id="loading">
      <v-progress-circular indeterminate color="yellow"></v-progress-circular>
    </div>
  </v-container>
</template>
<script>
export default {
  name: "App",
  data: () => ({
    message: null,
    mqtt: null,
    sirene: {
      status: false,
      motivo: null,
    },
    form_temp: {
      max: "",
      min: "",
    },
    form_luz: {
      time_start: "",
      time_end: "",
    },
    devices: [
      {
        id: 0,
        name: "Iluminação interna",
        status: false,
        time_start: null,
        time_end: null,
      },
      {
        id: 1,
        name: "Iluminação Garagem",
        status: false,
      },
      {
        id: 2,
        name: "Iluminação Jardim",
        status: false,
      },
      {
        id: 3,
        name: "Alarme",
        status: false,
      },
      {
        id: 4,
        name: "Ar Condicionado",
        status: false,
        max: null,
        min: null,
        temp_atual: null,
      },
    ],
    isLoading: false,
  }),
  methods: {
    createConnection() {
      try {
        // this.isLoading = true;
        this.mqtt = new Paho.MQTT.Client("maqiatto.com", 8883, "website");
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
      this.mqtt.subscribe("romaiajr5@gmail.com/web");
      var message = new Paho.MQTT.Message(
        JSON.stringify({
          event: "setup",
        })
      );
      message.destinationName = "romaiajr5@gmail.com/rasp";
    },
    onMessageArrived(message) {
      var res = JSON.parse(message.payloadString);
      if (res.event === "onChangeState") {
        this.setState(res.id, res.data.state);
      } else if (res.event === "onChangeInterval") {
        this.setInterval(res.id, res.data);
      } else if (res.event === "setup") {
        this.devices = res.data.devices;
        // this.isLoading = false;
      } else if (res.event === "onInvasion") {
        this.sirene = res.data.sirene;
        if (res.data.sirene) {
          console.log("invasão");
        }
      }
    },
    publish(message) {
      message.destinationName = "romaiajr5@gmail.com/rasp";
      this.mqtt.send(message);
    },
    changeState(device) {
      this.publish(
        new Paho.MQTT.Message(
          JSON.stringify({
            data: { state: device.status },
            event: "onChangeState",
            id: device.id,
          })
        )
      );
      console.log(device.status);
    },
    setState(id, state) {
      this.devices[id].status = state;
    },
    setInterval(id, data) {
      if (id === 0) {
        this.devices[0].time_start = data.time_start;
        this.devices[0].time_end = data.time_end;
      } else if (id === 4) {
        this.devices[4].max = data.max;
        this.devices[4].min = data.min;
      }
    },
    submit(type) {
      // this.isLoading = true;
      var message =
        type === 1
          ? JSON.stringify({
              data: {
                start: this.form_luz.time_start,
                end: this.form_luz.time_end,
              },
              event: "onChangeInterval",
              id: 0,
            })
          : JSON.stringify({
              data: { min: this.form_temp.min, max: this.form_temp.max },
              event: "onChangeInterval",
              id: 4,
            });
      this.publish(new Paho.MQTT.Message(message));
    },
  },
  computed: {
    isDisabled() {
      return this.devices[0].time_start === null ||
        this.devices[0].time_end === null
        ? true
        : false;
    },
  },
  created() {
    this.createConnection();
  },
};
</script>
<style>
#main-card {
  width: 50vw;
}
#ac {
  margin: 8px 0px;
}
#loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
}
</style>
