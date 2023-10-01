import { prisma } from "@/config";

async function findAllHotels(){
    const result = await prisma.hotel.findMany()
    return result
}

async function findRoomsOfHotel(hotelId:number) {
    return prisma.hotel.findFirst({
        where:{
            id: hotelId
        },
        include: {
            Rooms: true
        }
    })
}

export const hotelsRepository = {
    findAllHotels, findRoomsOfHotel
}