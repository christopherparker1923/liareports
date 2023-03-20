import { PartTags } from "@prisma/client";
import { z } from "zod";

export const partSchema = z.object({
  partNumber: z.string({ required_error: "Required" }),
  partType: z.string({ required_error: "Required" }),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  CSACert: z.boolean({ required_error: "Required" }),
  ULCert: z.boolean({ required_error: "Required" }),
  preference: z.number({ required_error: "Required" }).int().min(1).max(10),
  description: z.string().optional(),
  partTags: z.nativeEnum(PartTags, { required_error: "Required" }).array(),
  image: z.string().optional(),
  manufacturerName: z.string({ required_error: "Required" }),
});

export const vendorPartPriceLeadHistorySchema = z.object({
  startDate: z.date({ required_error: "Required" }),
  price: z.coerce.number({ required_error: "Required" }).min(0),
  leadTime: z.number({ required_error: "Required" }).min(0),
  stock: z.number({ required_error: "Required" }).min(0),
  vendorPartId: z.string({ required_error: "Required" }),
  // vendorName: z.string({ required_error: "Required" }),
});

export const manufacturerSchema = z.object({
  name: z.string({ required_error: "Required" }),
});

export const vendorSchema = z.object({
  name: z.string({ required_error: "Required" }),
});
