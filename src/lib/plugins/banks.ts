import Hapi from '@hapi/hapi'
import { queryBankValidator as queryValidator } from './validators/query';

// plugin to instantiate Banks
const banksPlugin = {
    name: 'app/banks',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/banks/list',
                handler: listHandler,
                options: {
                    validate: {
                        query: queryValidator
                    }
                }
            },
        ])
    }
}

export default banksPlugin;

//Handle Banks list
async function listHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app

    const { searchString } = request.query

    //Build query from payload
    const search = searchString ? {
        OR: [
            { name: { contains: searchString } },
            { id: { contains: searchString } },
        ],
    } : {}

    try {
        const banks = await prisma.bank.findMany({
            where: {
                ...search,
            },
        })

        return hapi.response(banks).code(200)

    } catch (err) {
        return hapi.response( { error: err } ).code(500);
    }
}  
