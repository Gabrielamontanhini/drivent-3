import app from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";

const server = supertest(app)

describe("/GET hotels", ()=>{
    //FALHA NA AUTENTICAÇÃO
    it("Should respond with status 401 when invalid token", async()=>{
        const token = faker.lorem.word();
        const {status} = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })
    it("Should respond with status 401 when no token is given",async () => {
        const {status} = await server.get("/hotels/");
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })
})