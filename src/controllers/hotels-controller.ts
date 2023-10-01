import { AuthenticatedRequest } from "@/middlewares";
import { hotelService } from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
    const {userId} = req
    const allHotels = await hotelService.findHotels(userId);
    res.status(httpStatus.OK).send(allHotels)
}