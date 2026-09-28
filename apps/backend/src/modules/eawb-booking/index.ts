import { Module } from "@medusajs/framework/utils"
import EawbBookingService from "./service"

export const EAWB_BOOKING_MODULE = "eawbBooking"
export default Module(EAWB_BOOKING_MODULE, { service: EawbBookingService })
