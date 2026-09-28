import EawbBookingService from "../service"
import { EawbApiError } from "../../eawb/client"

function registry() {
  const service = Object.create(EawbBookingService.prototype)
  const records: any[] = []
  service.listEawbBookings = jest.fn(async () => records)
  service.createEawbBookings = jest.fn(async (input) => {
    if (records.length) throw new Error("unique constraint")
    const record = { id: "booking_test", ...input }; records.push(record); return record
  })
  service.updateEawbBookings = jest.fn(async (update) => Object.assign(records[0], update))
  return { service: service as EawbBookingService, records }
}
const request = { carrier_id: 3, service_id: 1, extra: { internal_identifier: "order_test" } } as any
const booked = { order_id: 123, awb_number: "TEST-AWB" }

test("successful retries reuse the booked AWB without spending again", async () => {
  const { service } = registry()
  const client = { createOrder: jest.fn().mockResolvedValue(booked) } as any
  expect(await service.bookOnce("order_test", request, client)).toEqual(booked)
  expect(await service.bookOnce("order_test", request, client)).toEqual(booked)
  expect(client.createOrder).toHaveBeenCalledTimes(1)
})

test("concurrent requests cannot purchase two AWBs", async () => {
  const { service } = registry()
  const client = { createOrder: jest.fn().mockResolvedValue(booked) } as any
  await Promise.allSettled([service.bookOnce("order_test", request, client), service.bookOnce("order_test", request, client)])
  expect(client.createOrder).toHaveBeenCalledTimes(1)
})

test("uncertain timeout blocks future purchase attempts", async () => {
  const { service, records } = registry()
  const client = { createOrder: jest.fn().mockRejectedValue(new EawbApiError(0, true)) } as any
  await expect(service.bookOnce("order_test", request, client)).rejects.toThrow()
  expect(records[0].status).toBe("uncertain")
  await expect(service.bookOnce("order_test", request, client)).rejects.toThrow("uncertain")
  expect(client.createOrder).toHaveBeenCalledTimes(1)
})

test("crash after purchase but before persistence leaves a durable pending guard", async () => {
  const { service, records } = registry()
  ;(service.updateEawbBookings as jest.Mock).mockRejectedValueOnce(new Error("DB unavailable"))
  const client = { createOrder: jest.fn().mockResolvedValue(booked) } as any
  await expect(service.bookOnce("order_test", request, client)).rejects.toThrow("DB unavailable")
  expect(records[0].status).toBe("pending")
  await expect(service.bookOnce("order_test", request, client)).rejects.toThrow("pending")
  expect(client.createOrder).toHaveBeenCalledTimes(1)
})

test("changed shipment data cannot reuse an old AWB", async () => {
  const { service } = registry()
  const client = { createOrder: jest.fn().mockResolvedValue(booked) } as any
  await service.bookOnce("order_test", request, client)
  await expect(service.bookOnce("order_test", { ...request, carrier_id: 5 }, client)).rejects.toThrow()
  expect(client.createOrder).toHaveBeenCalledTimes(1)
})
