export default {
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
};
