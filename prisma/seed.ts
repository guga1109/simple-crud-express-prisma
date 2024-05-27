import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        name: 'Gustavo',
        email: 'gustavo@gmail.com',
        posts: {
            create: [
                {
                    title: 'Test 1',
                    content: 'test 1',
                    active: true,
                },
            ],
        },
    },
    {
        name: 'Nilu',
        email: 'nilu@prisma.io',
        posts: {
            create: [
                {
                    title: 'test 2',
                    content: 't2',
                    active: true,
                },
            ],
        },
    },
    {
        name: 'Mahmoud',
        email: 'mahmoud@prisma.io',
        posts: {
            create: [
                {
                    title: 'test 3',
                    content: 't3',
                    active: true,
                },
                {
                    title: 'Prisma on YouTube',
                    content: 'https://pris.ly/youtube',
                },
            ],
        },
    },
]

async function main() {
    console.log(`Start seeding ...`)
    for (const u of userData) {
        const user = await prisma.user.create({
            data: u,
        })
        console.log(`Created user with id: ${user.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })