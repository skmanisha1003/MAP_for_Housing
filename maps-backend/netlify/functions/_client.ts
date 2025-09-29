import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export function getPrismaClient(): PrismaClient {
  if (!global.__prisma__) {
    global.__prisma__ = new PrismaClient();
  }
  return global.__prisma__;
}


