'use server';
import { PrismaClient } from '@prisma/client';
import { convertToPlainObject } from '../utils';
import { Product } from '../types';
import {LATEST_PRODUCTS_LIMIT} from '../constants';
const prisma = new PrismaClient();

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
