import { Voucher } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const createVoucherService = async (body: Voucher, userId: number) => {
  try {
    // Memeriksa apakah kode voucher sudah ada
    const existingVoucher = await prisma.voucher.findFirst({
      where: {
        voucherCode: body.voucherCode,
      },
    });

    if (existingVoucher) {
      throw new Error("Voucher Code is Already exist");
    }

    // Mengambil tanggal mulai event
    const event = await prisma.event.findUnique({
      where: { id: body.eventId },  // Pastikan eventId ada di body
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const eventStartDate = new Date(event.startDate); 
    const voucherExpiryDate = new Date(eventStartDate);

    const newData = await prisma.voucher.create({
      data: {
        userId: userId,
        eventId: body.eventId,
        voucherCode: body.voucherCode,
        qty: body.qty,
        value: body.value,
        validFrom: new Date(body.validFrom),
        validUntil: voucherExpiryDate
      },
    });

    return newData;
  } catch (error) {
    throw error;
  }
};
