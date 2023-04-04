import InMemoryPersistence, { Persistence } from "../src/persistence/inMemory";
import { signTransaction } from "../src/api/signTransaction";
import { generateEcKeyPair } from "../src/crypto/generation";
import { AlgorithmEnum } from "../src/domain/device";

describe("signTransaction", () => {
  const persistence = new InMemoryPersistence();
  let deviceId: string;

  beforeEach(async () => {
    deviceId = "test-device-id";
    const keyPair = await generateEcKeyPair();
    await persistence.set({
      id: deviceId,
      algorithm: AlgorithmEnum.EC,
      label: "test-label",
      privateKey: keyPair.private,
      publicKey: keyPair.public,
      signatureCounter: 0,
    });
  });

  afterEach(async () => {
    await persistence.delete(deviceId);
  });

  it("should sign a transaction with a valid device", async () => {
    const data = "test-data";
    const result = await signTransaction(deviceId, data, persistence);
    const expectedData = `0_${data}_${Buffer.from(deviceId).toString(
      "base64"
    )}`;

    const device = await persistence.get(deviceId);

    expect(result.signature).toEqual(device?.lastSignature);
    expect(result.signedData).toEqual(expectedData);
  });

  it("should throw an error if the device ID is invalid", async () => {
    const data = "test-data";
    const invalidDeviceId = "";

    await expect(
      signTransaction(invalidDeviceId, data, persistence)
    ).rejects.toThrowError("Invalid deviceId");
  });

  it("should throw an error if the data is invalid", async () => {
    const invalidData = "";

    await expect(
      signTransaction(deviceId, invalidData, persistence)
    ).rejects.toThrowError("Invalid data");
  });

  it("should throw an error if the device is not found", async () => {
    const data = "test-data";
    const invalidDeviceId = "invalid-device-id";

    await expect(
      signTransaction(invalidDeviceId, data, persistence)
    ).rejects.toThrowError("Device not found");
  });
});
