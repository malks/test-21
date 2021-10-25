import Hapi from '@hapi/hapi'
import joi from 'joi'

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
                options: {
                    validate: {
                        query: joi.object({
                            take: joi.number().integer(),
                            skip: joi.number().integer(),
                            orderDirection: joi.string().alphanum().min(3).max(4),
                            searchString:   joi.string().alphanum(),
                        })
                    }
                }
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/create',
                handler: createHandler,
                options: {
                    validate: {
                        payload: joi.object({
                            email:                  joi.string().email(),
                            name:                   joi.string().min(3).pattern(/^[A-Za-z]+$/),
                            cpf:                    joi.string().pattern(/^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/),
                            status:                 joi.string().pattern(/^(draft|valid)$/),
                            account_bank:           joi.string().alphanum(),
                            account_agency:         joi.string().max(4).required().pattern(/^(?:^0*)[1-9][0-9]{0,3}$/),
                            account_agency_digit:   joi.alternatives().
                                                        conditional( joi.ref('account_bank'), 
                                                            { 
                                                                is: '001', 
                                                                then:       joi.string().pattern(/^[xX0-9]{0,1}$/),
                                                                otherwise:  joi.string().pattern(/^[0-9]{0,1}$/),
                                                            },
                                                        ),
                            account_type:           joi.string().pattern(/^(savings|checking)$/),
                            account_number:         joi.alternatives().
                                                        conditional( joi.ref('account_bank'), 
                                                            { 
                                                                is: '001', 
                                                                then:       joi.string().max(8).required().pattern( /^(?:^0*)[1-9][0-9]{0,7}$/),
                                                                otherwise:  joi.string().max(11).required().pattern( /^(?:^0*)[1-9][0-9]{0,10}$/),
                                                            },
                                                        ),
                            account_number_digit:   joi.alternatives().
                                                        conditional( joi.ref('account_bank'), 
                                                            { 
                                                                is: '001', 
                                                                then:       joi.string().pattern(/^[xX0-9]{0,1}$/),
                                                                otherwise:  joi.string().pattern(/^[0-9]{0,1}$/),
                                                            },
                                                        ),
                        })
                    }
                }
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
