import { AlgorithmEnum, SignatureResponse } from "../domain/device";
import { Persistence } from "../persistence/inMemory";
import { RSASigner } from "../crypto/rsa";
import { ECDSASigner } from "../crypto/ecdsa";
import { KeyPair } from "../crypto/generation";

export async function signTransaction(
  deviceId: string,
  data: string,
  persistence: Persistence
): Promise<SignatureResponse> {
  if (!deviceId || deviceId.length < 1) {
    throw new Error("Invalid deviceId");
  }

  if (!data || data.length < 1) {
    throw new Error("Invalid data");
  }

  const device = await persistence.get(deviceId);

  if (!device) {
    throw new Error("Device not found");
  }

  let Signer;
  switch (device.algorithm) {
    case AlgorithmEnum.EC:
      Signer = new ECDSASigner();
      break;
    case AlgorithmEnum.RSA:
      Signer = new RSASigner();
      break;
    default:
      throw new Error("Algorithm not supported");
  }

  const keyPair = {} as KeyPair;
  try {
    if (device.privateKey && device.publicKey) {
      keyPair.private = device.privateKey;
      keyPair.public = device.publicKey;
    }
  } catch (e) {
    console.log(e);
    throw new Error("Error retrieving keypair");
  }

  const signatureCounter = device.signatureCounter;
  const lastSignature =
    device.lastSignature || Buffer.from(device.id).toString("base64");

  const securedDataToBeSigned = `${signatureCounter}_${data}_${lastSignature}`;
  const signature = Signer.sign(securedDataToBeSigned, keyPair);

  try {
    await persistence.set({
      ...device,
      signatureCounter: signatureCounter + 1,
      lastSignature: signature as string,
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error setting device in persistence layer");
  }

  return {
    signature: signature as string,
    signedData: securedDataToBeSigned,
  };
}
