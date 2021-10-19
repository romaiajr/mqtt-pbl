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
              <br />
              <div>
                <v-btn depressed color="success" small block @click="showLog"
                  >Histórico do Alarme</v-btn
                >
              </div>
              <br />
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
    <v-dialog v-model="show" width="750">
      <v-card>
        <v-card-title class=" primary">
          <h5 :style="{ color: 'white' }">Histórico do Alarme</h5>
        </v-card-title>
        
        <v-card-text >
          <div v-if="logs"> <v-simple-table >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Horário
                  </th>
                  <th class="text-left">
                    Motivo
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.horario">
                  <td>{{ log.horario }}</td>
                  <td>{{ log.motivo }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table></div>
         
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="show = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import api from "../services/api";
export default {
  name: "App",
  data: () => ({
    mqtt: null,
    sirene: {
      status: false,
      motivo: null,
    },
    form_temp: {
      max: null,
      min: null,
    },
    form_luz: {
      time_start: null,
      time_end: null,
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
    show: false,
    logs: [],
  }),
  methods: {
    createConnection() {
      try {
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
      var message = new Paho.MQTT.Message("setup");
      message.destinationName = "romaiajr5@gmail.com/rasp";
    },
    async onMessageArrived(message) {
      // var res = JSON.parse(message.payloadString);
      // if (res.event === "onChangeState") {
      //   this.setState(res.id, res.data.state);
      // } else if (res.event === "onChangeInterval") {
      //   this.setInterval(res.id, res.data);
      // } else if (res.event === "setup") {
      //   this.devices = res.data.devices;
      //   // this.isLoading = false;
      // } else if (res.event === "onInvasion") {
      //   this.sirene = res.data.sirene;
      //   if (res.data.sirene) {
      //     console.log("invasão");
      //   }
      // }
      var res = message.payloadString;
      var message = res.split(",");
      if (message[0] === "onChangeState") {
        this.setState(message[1], message[2]);
      } else if (
        ["onChangeDateInterval", "onChangeTempInterval"].includes(message[0])
      ) {
        this.setInterval(message[1], message[2], message[3]);
      } else if (message[0] === "onInvasion") {
        this.sirene.status = message[2];
        this.sirene.motivo = message[3];
        if (message[2] === "1") {
          await api.newLog({
            status: true,
            motivo: this.sirene.motivo,
            horario: this.dateNow(),
          });
        }
      }
    },
    publish(message) {
      console.log(message);
      message.destinationName = "romaiajr5@gmail.com/rasp";
      this.mqtt.send(message);
    },
    changeState(device) {
      // this.publish(
      //   new Paho.MQTT.Message(
      //     JSON.stringify({
      //       data: { state: device.status },
      //       event: "onChangeState",
      //       id: device.id,
      //     })
      //   )
      // );
      this.publish(
        new Paho.MQTT.Message(`onChangeState,${device.id},${device.status}`)
      );
    },
    setState(id, state) {
      // this.devices[id].status = state;
      this.devices[id].status = state === "1" ? true : false;
    },
    setInterval(id, start, end) {
      // if (id === 0) {
      //   this.devices[0].time_start = data.time_start;
      //   this.devices[0].time_end = data.time_end;
      // } else if (id === 4) {
      //   this.devices[4].max = data.max;
      //   this.devices[4].min = data.min;
      if (id === 0) {
        this.devices[0].time_start = start;
        this.devices[0].time_end = end;
      } else if (id === 4) {
        this.devices[4].max = start;
        this.devices[4].min = end;
      }
    },
    submit(type) {
      // this.isLoading = true;
      var message =
        type === 1
          ? `onChangeDateInterval, 0, ${
              this.form_luz.time_start.split(":")[0]
            }, ${this.form_luz.time_end.split(":")[0]}`
          : // JSON.stringify({
            //   data: {
            //     start: this.form_luz.time_start,
            //     end: this.form_luz.time_end,
            //   },
            //   event: "onChangeInterval",
            //   id: 0,
            // })
            `onChangeTempInterval, 4, ${this.form_temp.min}, ${this.form_temp.max}`;
      // JSON.stringify({
      //     data: { min: this.form_temp.min, max: this.form_temp.max },
      //     event: "onChangeInterval",
      //     id: 4,
      //   });
      this.publish(new Paho.MQTT.Message(message));
    },
    dateNow() {
      var today = new Date();
      var date =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      var time =
        today.getHours() + ":" + today.getMinutes();
      var dateTime = date + " " + time;
      return dateTime;
    },
    async showLog() {
      this.show = true;
      var res = await api.getLog()
      this.logs = res.data;
    },
  },
  computed: {
    isDisabled() {
      return this.form_luz.time_start !== null &&
        this.form_luz.time_end !== null
        ? this.form_luz.time_start.split(":")[0] !==
          this.form_luz.time_end.split(":")[0]
          ? false
          : true
        : true;
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
