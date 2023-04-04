import * as fs from "fs";
class InMemoryPersistence {
    constructor() {
        this.data = [];
        this.load();
    }
    load() {
        try {
            const data = fs.readFileSync("./data.json");
            this.data = JSON.parse(data.toString());
        }
        catch (err) {
            // File doesn't exist or is corrupted
            this.data = [];
        }
    }
    save() {
        const data = JSON.stringify(this.data);
        fs.writeFileSync("./data.json", data);
    }
    async get(id) {
        return this.data.find((item) => item.id === id);
    }
    async set(data) {
        const index = this.data.findIndex((item) => item.id === data.id);
        if (index === -1) {
            this.data.push(data);
        }
        else {
            this.data[index] = data;
        }
        this.save();
    }
    async del(id) {
        const index = this.data.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.data.splice(index, 1);
            this.save();
        }
    }
    async clear() {
        this.data = [];
        this.save();
    }
    async delete(id) {
        const index = this.data.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.data.splice(index, 1);
            this.save();
        }
    }
    async getAll() {
        return [...this.data];
    }
}
export default InMemoryPersistence;
//# sourceMappingURL=inMemory.js.map