<template>
  <v-container > 
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
                    <v-btn class="mx-2" fab large :color="device.status ? '#d3f8d3' : 'white'">
                      <v-icon large >
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
                    <v-btn class="mx-2" fab large :color="sensor.color" @click="sensor.status = !sensor.status">
                      <v-icon large >
                        {{ sensor.icon }}
                      </v-icon>
                    </v-btn>
                    {{ sensor.name === "Horário" ? new Date().toLocaleTimeString() : sensor.name === "Temperatura Externa" ? "23ºC" : sensor.status ? "Ativo" : "Desligado" }}
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
        name: "Presença",
        status: false,
        icon: "mdi-account-question-outline",
        color: "white",
      },
      {
        name: "Abertura",
        status: false,
        icon: "mdi-door-open",
        color: "white",
      },
      {
        name: "Horário",
        status: false,
        icon: "mdi-clock-outline",
        color: "white",
      },
      {
        name: "Temperatura Externa",
        status: false,
        icon: "mdi-thermometer",
        color: "white",
      },
    ],
  }),
};
</script>
<style>
#main-card {
  width: 100vw;
}
</style>
