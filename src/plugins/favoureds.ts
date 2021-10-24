import Hapi from '@hapi/hapi'

// plugin to instantiate Favoureds
const favouredsPlugin = {
    name: 'app/favoureds',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/favoureds/create',
                handler: createHandler,
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/{favouredId}/update',
                handler: updateHandler,
            },
        ]),
        server.route([
            {
                method: 'DELETE',
                path: '/favoureds/{favouredId}/delete',
                handler: deleteHandler,
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/list',
                handler: listHandler,
            },
        ])
    },
}

export default favouredsPlugin;

//Handle Favoured creation
async function createHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;
    const payload    = request.payload as any;

    try {
        const createdFavoured = await prisma.favoured.create({
            data: payload,
        })
        return h.response(createdFavoured).code(201);
    } catch (err) {
        console.log(err);
    }
}

//Handle Favoured creation
async function updateHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;

    const favouredId = Number(request.params.favouredId)
    const payload    = request.payload as any;

    try {
        const favoured = await prisma.favoured.update({
            where: { id: favouredId },
            data: payload,
        })
        return h.response(favoured).code(201);
    } catch (err) {
        console.log(err);
    }
}

//Handle Favoured delete
async function deleteHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app

    const favouredId = Number(request.params.favouredId)

    try {
        const favouredDeleted = await prisma.favoured.delete({
            where: { id: favouredId },
        })
        return h.response(favouredDeleted || undefined).code(201)
    } catch (err) {
        console.log(err)
        return h.response({
            error: `Favoured with ID ${favouredId}es not exist in the database`,
        })
    }
}  

//Handle Favoureds list
async function listHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app

    const { searchString, skip, take, orderDirection } = request.query

    //Build query from payload
    const search = searchString ? {
        OR: [
            { name: { contains: searchString } },
            { cpf : { contains: searchString } },
            { account_number : { contains: searchString } },
            { account_agency : { contains: searchString } },
        ],
    } : {}

    try {
        const favoureds = await prisma.favoured.findMany({
            where: {
                ...search,
            },
            take: Number(take) || undefined,
            skip: Number(skip) || undefined,
            orderBy: {
                id: orderDirection || undefined,
            },
        })

        return h.response(favoureds).code(200)
    } catch (err) {
        console.log(err)
    }
}  