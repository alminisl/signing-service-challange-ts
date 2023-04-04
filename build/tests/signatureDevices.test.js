import { signNewDevice } from "../src/api/signatureDevices";
import { AlgorithmEnum } from "../src/domain/device";
import InMemoryPersistence from "../src/persistence/inMemory";
describe("signNewDevice", () => {
    let persistence;
    beforeEach(() => {
        persistence = new InMemoryPersistence();
    });
    afterEach(() => {
        persistence.clear();
    });
    it("should throw an error if device ID is not provided", async () => {
        await expect(signNewDevice("", AlgorithmEnum.EC, persistence)).rejects.toThrow("Device ID is required");
    });
    it("should throw an error if label is too long", async () => {
        await expect(signNewDevice("device1", AlgorithmEnum.EC, persistence, "this is a very long label that exceeds the maximum length of 50 characters")).rejects.toThrow("Label exceeds maximum length of 50 characters");
    });
    it("should create a new device with a valid ID and algorithm", async () => {
        const response = await signNewDevice("device1", AlgorithmEnum.EC, persistence);
        expect(response).toEqual({
            id: "device1",
            publicKey: expect.any(String),
        });
    });
    it("should throw an error if device with same ID already exists", async () => {
        await persistence.set({
            id: "device1",
            algorithm: AlgorithmEnum.EC,
            label: "test",
            privateKey: "privateKey",
            publicKey: "publicKey",
            signatureCounter: 0,
        });
        await expect(signNewDevice("device1", AlgorithmEnum.EC, persistence)).rejects.toThrow("Device already exists");
    });
});
//# sourceMappingURL=signatureDevices.test.js.map