import { notFoundError } from "@/errors"
import { listHotelsError } from "@/errors/list-hotels-error"
import { enrollmentRepository, hotelsRepository, ticketsRepository } from "@/repositories"

async function findHotels(userId: number) {
    await listHotelsToUser(userId)
    const hotels = await hotelsRepository.findAllHotels()
    return hotels
}

async function listHotelsToUser(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!enrollment) throw notFoundError()
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw listHotelsError()
    }
}

export const hotelService={
    findHotels
}