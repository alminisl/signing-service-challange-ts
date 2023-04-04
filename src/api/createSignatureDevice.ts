import generateKeyPair, { KeyPair } from "../crypto/generation";
import { AlgorithmEnum, CreateSignatureDeviceResponse } from "../domain/device";
import { Persistence } from "../persistence/inMemory";

export async function createSignatureDevice(
  deviceId: string,
  algorithm: AlgorithmEnum,
  persistence: Persistence,
  label?: string
): Promise<CreateSignatureDeviceResponse> {
  if (!deviceId || deviceId.length < 1) {
    throw new Error("Device ID is required");
  }

  if (label && label.length > 50) {
    throw new Error("Label exceeds maximum length of 50 characters");
  }

  if (algorithm !== AlgorithmEnum.EC && algorithm !== AlgorithmEnum.RSA) {
    throw new Error("Invalid algorithm");
  }
  const device = await persistence.get(deviceId);

  if (device) {
    throw new Error("Device already exists");
  }

  let keyPair = {} as KeyPair;
  try {
    keyPair = await generateKeyPair(algorithm);
  } catch (e) {
    console.log(e);
    throw new Error("Error generating keypair");
  }

  try {
    await persistence.set({
      id: deviceId,
      algorithm,
      label,
      privateKey: keyPair.private,
      publicKey: keyPair.public,
      signatureCounter: 0,
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error setting device in persistence layer");
  }

  return {
    id: deviceId,
    publicKey: keyPair.public,
  };
}
