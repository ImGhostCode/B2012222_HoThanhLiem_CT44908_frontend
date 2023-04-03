
import createApiClient from "./api.service";

class ContactService {
    constructor(baseUrl = "/api/contacts") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return await (
            await this.api.get("/")
        ).data.data;
    }
    async create(data) {
        return await (
            await this.api.post("/", data)
        ).data.data;
    }
    async deleteAll() {
        return await (
            await this.api.delete("/")
        ).data.data;
    }
    async get(id) {
        return await (
            await this.api.get(`/${id}`)
        ).data.data;
    }
    async update(id, data) {
        return await (
            await this.api.put(`/${id}`, data)
        ).data.data;
    }
    async delete(id) {
        return await (
            await this.api.delete(`/${id}`)
        ).data.data;
    }
}
export default new ContactService();