import { AuthenticatedRequest } from "@/middlewares";
import { hotelService } from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
    const {userId} = req
    const allHotels = await hotelService.findHotels(userId);
    res.status(httpStatus.OK).send(allHotels)
}

export async function getRoomsOfHotelId(req: AuthenticatedRequest, res: Response){
    const {userId} = req;
    const hotelId = Number(req.params.hotelId)
    const hotels = await hotelService.findRoomsOfHotel(userId, hotelId)
    return res.status(httpStatus.OK).send(hotels)
}