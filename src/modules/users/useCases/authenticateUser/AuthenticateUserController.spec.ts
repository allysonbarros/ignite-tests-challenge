import request from "supertest";
import { app } from "../../../../app";

describe("Authenticate User Controller", () => {
    it("Should be able to authenticate a User", async () => {
        const response = await request(app).post('/api/v1/sessions')
            .send({ email: 'a@a.com', password: '123456' });

        console.log(response);

        expect(response.status).toBe(200);
    });

});