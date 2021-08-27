import request from "supertest";
import { app } from "../../../../app";

describe("Create User Controller", () => {
    it("Should be able to create a User", async () => {
        const response = await request(app).post('/api/v1/users')
            .send({ name: 'Allyson Barros', email: 'a@a.com', password: '123456' })

        expect(response.status).toBe(200);
    });
});