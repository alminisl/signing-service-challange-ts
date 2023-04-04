import express from "express";
import bodyParser from "body-parser";
import generateKeyPair from "../crypto/generation";
import InMemoryPersistence from "../persistence/inMemory";
// import { SignatureDevice } from "../domain/device";
const server = express();
const persistence = new InMemoryPersistence();
server.use(bodyParser.json());
server.get("/health", (req, res) => {
  res.status(200);
  res.send(
    JSON.stringify({
      status: "pass",
      version: "v1",
    })
  );
});
server.post("/signature-devices", async (req, res) => {
  const { id, algorithm, label } = req.body;
  // Check if all the params are present and valid
  if (!id || !algorithm || !label) {
    res.status(400).json({ message: "Missing required parameters" });
    return;
  }

  const keyPair = await generateKeyPair(algorithm);
  await persistence.set({
    id,
    algorithm,
    label,
    privateKey: keyPair.private,
    publicKey: keyPair.private,
    signatureCounter: 0,
  });

  res.status(201).json({ message: "Signature device created" });
});
server.post("/transactions", (req, res) => {
  const { data } = req.body;
  const device = {}; //signatureDevices[0]; // for simplicity, assume only one device exists
  const lastSignature =
    device.signatureCounter === 0
      ? Buffer.from(device.id).toString("base64")
      : "TODO: get last signature";
  const securedDataToBeSigned = `${device.signatureCounter}_${data}_${lastSignature}`;
  const signature = "TODO: sign secured data to be signed";
  device.signatureCounter += 1;
  res.json({
    signature: signature,
    signedData: securedDataToBeSigned,
  });
});
export default server;
//# sourceMappingURL=server.js.map
