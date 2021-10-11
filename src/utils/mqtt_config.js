const config = {
    connection:{
        host: "broker.emqx.io",
        port: "8083",
        endpoint:"/mqtt",
        clean: true, 
        connectTimeout: 4000, 
        reconnectPeriod: 4000,
        clientId: "mqttjs_3be2c321",
        username: "emqx_test",
        password: "emqx_test"
    },
    subscription: {
        topic: 'topic/mqttx',
        qos: 0,
      },
      publish: {
        topic: 'topic/browser',
        qos: 0,
        payload: '{ "msg": "Hello, I am browser." }',
      },
      receiveNews: '',
      qosList: [
        { label: 0, value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 },
      ],
      subscribeSuccess: false,
}

export default config;
