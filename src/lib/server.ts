import Hapi from '@hapi/hapi'
import prisma from './plugins/prisma'
import favoureds from './plugins/favoureds'

//Instantiate server
export const server: Hapi.Server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
})

//Server init for testing
export async function init(): Promise<Hapi.Server> {
    await server.register([prisma, favoureds])
    await server.initialize();
    return server;
};

//Server start function
export async function start(): Promise<Hapi.Server> {
    await server.register([prisma, favoureds])
    await server.start()
    console.log(`Server ready at: ${server.info.uri}`)
    return server
}

//Handling Unhandled Rejections
process.on('unhandledRejection', async (err) => {
    await server.app.prisma.$disconnect()
    console.log(err)
    process.exit(1)
})