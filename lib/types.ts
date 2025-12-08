import { z } from "zod";
import { insertProductSchema } from "./validator";

export type Product = Omit<z.infer<typeof insertProductSchema>, "price"> & {
  id: string;
  price: number;
  rating: number;
  numReviews: number;
  createdAt: Date;
};
