import axios from "axios";

var api = axios.create({
  baseURL: "http://consensofeira.ddns.net:3100",
});

export default {
    getLog: () => {
        return api.get("/obterJSON")
    },
    newLog: (log) => {
        return api.post("/escreverJSON",log)
    }
}