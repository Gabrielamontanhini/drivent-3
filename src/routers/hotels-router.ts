import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllHotels } from "@/controllers/hotels-controller";

const hotelsRouter = Router()

hotelsRouter.all("/*", authenticateToken)
hotelsRouter.get("/", getAllHotels)
hotelsRouter.get("/:hotelId")

export { hotelsRouter }