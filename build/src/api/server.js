import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import InMemoryPersistence from "../persistence/inMemory";
import { signNewDevice } from "./signatureDevices";
import { signTransaction } from "./signTransaction";
const server = express();
const persistence = new InMemoryPersistence();
server.use(bodyParser.json());
server.use(cors());
server.get("/health", (req, res) => {
    res.status(200);
    res.send(JSON.stringify({
        status: "pass",
        version: "v1",
    }));
});
// TODO: REST endpoints ...
server.post("/signature-devices", async (req, res) => {
    const { id, algorithm, label } = req.body;
    //TODO: Add Enum for algorhitm
    try {
        const response = await signNewDevice(id, algorithm, persistence, label);
        console.log("RESPONSE: ", response);
        res.status(201).json(response);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
server.post("/signTransaction/:device_id", async (req, res) => {
    const { device_id } = req.params;
    const { data } = req.body;
    try {
        const response = await signTransaction(device_id, data, persistence);
        res.status(200).json(response);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
server.get("/signature-devices/:device_id", async (req, res) => {
    const { device_id } = req.params;
    try {
        const device = await persistence.get(device_id);
        res.status(200).json(device);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
});
server.get("/signature-devices", async (req, res) => {
    try {
        const devices = await persistence.getAll();
        res.status(200).json(devices);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
});
export default server;
//# sourceMappingURL=server.js.map