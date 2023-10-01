import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { createEnrollmentWithAddress, createHotel, createRemoteTypeTicket, createTicket, createTicketType, createTicketWithHotel, createTicketWithouHotel, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";


const server = supertest(app)

beforeAll(async () => {
    await init();
    await cleanDb();
})

beforeEach(async () => {
    await cleanDb();
})


describe("/GET hotels", () => {
    //FALHA NA AUTENTICAÇÃO
    it("Should respond with status 401 when invalid token", async () => {
        const token = faker.lorem.word();
        const { status } = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })
    it("Should respond with status 401 when no token is given", async () => {
        const { status } = await server.get("/hotels/");
        expect(status).toBe(httpStatus.UNAUTHORIZED)
    })


    it("should respond with status 402 when user ticket, even paid, is remote", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketRemote = await createRemoteTypeTicket();
        const ticket = await createTicket(enrollment.id, ticketRemote.id, TicketStatus.PAID)
        const { status } = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.PAYMENT_REQUIRED)
    })

    it("should respond with status 402 when user ticket, even paid, does not include hotel", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketWithoutHotel = await createTicketWithouHotel();
        const ticket = await createTicket(enrollment.id, ticketWithoutHotel.id, TicketStatus.PAID)
        const { status } = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.PAYMENT_REQUIRED)
    })

    it("should respond with status 402 when user ticket, even including hotel, is not paid", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketWithHotel = await createTicketWithHotel();
        const ticket = await createTicket(enrollment.id, ticketWithHotel.id, TicketStatus.RESERVED)
        const { status } = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.PAYMENT_REQUIRED)
    })





    it("should respond with status 404 when user has no enrollment", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        await createTicketType()
        const { status } = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.NOT_FOUND)
    })

    it("should respond with status 404 when there is no hotels, even with paid ticket including hotel", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketWithHotel = await createTicketWithHotel();
        const ticket = await createTicket(enrollment.id, ticketWithHotel.id, TicketStatus.PAID)



        const { status } = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.NOT_FOUND)
    })




    it("should respond with status 200 and a list of hotels", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketWithHotel = await createTicketWithHotel();
        await createTicket(enrollment.id, ticketWithHotel.id, TicketStatus.PAID)

        const hotel = await createHotel() //TODO

        const { status, body } = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual([
            {
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString()
            }
        ])
    })
})

describe("/GET hotels/:hotelId", () => {

})