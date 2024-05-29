import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient().$extends({
       model: {
           user: {
              async signUp(name: string, email: string, password: string) {
                  const passwordHash = bcrypt.hashSync(password, 10);
                  await prisma.user.create({
                      data: {
                          email: email,
                          passwordHash: passwordHash,
                          name: name
                      }
                  })
              }
           }
       } 
    });
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma