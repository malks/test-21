import Hapi from '@hapi/hapi'

// plugin to instantiate Favoureds
const favouredsPlugin = {
    name: 'app/favoureds',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/favoureds/list',
                handler: listHandler,
            },
        ]),
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
                path: '/favoureds/update/{favouredId}',
                handler: updateHandler,
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/delete',
                handler: deleteManyHandler,
            },
        ])
    }
}

export default favouredsPlugin;

//Handle Favoureds list
async function listHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
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

        return hapi.response(favoureds).code(200)

    } catch (err) {
        return hapi.response( { error: err } ).code(500);
    }
}  

//Handle Favoured creation
async function createHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;
    const payload    = request.payload as any;

    try {
        const createdFavoured = await prisma.favoured.create({
            data: payload,
        })
        return hapi.response(createdFavoured).code(201);
    } catch (err) {
        return hapi.response( { error: err } ).code(500);
    }
}

//Handle Favoured update
async function updateHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;

    const favouredId = Number(request.params.favouredId)
    const payload    = request.payload as any;

    try {
        const checkFavoured = await prisma.favoured.findFirst({
            where: { id: favouredId}
        })
        
        //Valid favoured can only have e-mail altered
        if (checkFavoured!=null && checkFavoured.status=='valid' && ( Object.keys(payload).length>1 || ( Object.keys(payload).length==1 && payload.email==null) ) )
            return hapi.response( { error : 'Favorecido validado pode ter somente o e-mail alterado' } ).code(403);

        const favoured = await prisma.favoured.update({
            where: { id: favouredId },
            data: payload,
        })
        return hapi.response(favoured).code(201);
    } catch (err) {
        return hapi.response( { error: err } ).code(500);
    }
}

//Handle Favoured delete
async function deleteManyHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma }      = request.server.app
    const { favouredIds } = request.payload as any;
    
    const arrayIds = String(favouredIds).split(",").map( Number );

    try {
        const favouredDeleted = await prisma.favoured.deleteMany({
            where: { id: { in: arrayIds } },
        })
        return hapi.response(favouredDeleted || undefined).code(201)
    } catch (err) {
        console.log(err);
        return hapi.response( { error: "Something went wrong x.x" } ).code(500);
    }
}
