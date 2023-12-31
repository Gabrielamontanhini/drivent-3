import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllHotels, getRoomsOfHotelId } from "@/controllers/hotels-controller";

const hotelsRouter = Router()

hotelsRouter.all("/*", authenticateToken)
hotelsRouter.get("/", getAllHotels)
hotelsRouter.get("/:hotelId", getRoomsOfHotelId)

export { hotelsRouter }