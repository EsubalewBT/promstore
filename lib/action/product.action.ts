'use server';
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from '../utils';
import { Product } from '../types';
import {LATEST_PRODUCTS_LIMIT} from '../constants';


export async function getLatestProducts(): Promise<Product[]> {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  const products = data.map((product) => ({
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
  }));

  return convertToPlainObject(products);
}
// get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: { slug },
  });

  if (!product) {
    return null;
  }

  const normalizedProduct: Product = {
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
  };

  return convertToPlainObject(normalizedProduct);
}