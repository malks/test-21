import Hapi from '@hapi/hapi'
import joi from 'joi';
import { changeValidator, createValidator } from './validators/mutation';
import queryValidator from './validators/query';

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
                options: {
                    validate: {
                        payload: createValidator,
                    },
                    response:{
                        failAction: 'error'
                    },
                },
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/update/{favouredId}',
                handler: updateHandler,
                options: {
                    validate: {
                        payload: changeValidator
                    },
                    response:{
                        failAction: 'log'
                    },
                }
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/delete',
                handler: deleteManyHandler,
                options: {
                    validate: {
                        payload: joi.object({ favouredIds: joi.string().required() })
                    },
                    response:{
                        failAction: 'error'
                    },
                }
            },
        ])
    }
}

export default favouredsPlugin;

//Handle Favoureds list
async function listHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app

    const { searchString, skip, take, orderDirection } = request.query

    //Default response
    let res={
        status:'error',
        message:'Oops, something went terribly wrong...',
        data:{},
    };

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
        //Ask the sage
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
        console.log(err);
        return hapi.response(res).code(500);
    }
}  

//Handle Favoured creation
async function createHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;
    const payload    = request.payload as any;

    //Default response
    let res={
        status:'error',
        message:'Warning! Favoured compromised!',
        data:{},
    };

    try {
        //Feed the favoured to the bank, prisma hungry
        const createdFavoured = await prisma.favoured.create({
            data: payload,
        })

        //If it worked
        if (createdFavoured!=null){
            res={
                status:'success',
                message:'Favoured has been accepted!',
                data:createdFavoured,
            }
        }

        return hapi.response(res).code(201);
    } catch (err) {
        console.log(err);
        return hapi.response(res).code(500);
    }
}

//Handle Favoured update
async function updateHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;

    const favouredId = Number(request.params.favouredId)
    const payload    = request.payload as any;

    //Default response
    let res={
        status:'error',
        message:'Warning! Update action compromised!',
        data:{},
    };

    try {
        //Does favoured exist?
        const checkFavoured = await prisma.favoured.findFirst({
            where: { id: favouredId}
        })

        //Valid favoured can only have e-mail altered
        if (checkFavoured!=null && checkFavoured.status=='valid' && ( Object.keys(payload).length>1 || ( Object.keys(payload).length==1 && payload.email==null) ) ){
            return hapi.response( res ).code(402);
        }

        //Let prisma do the update trick
        const favoured = await prisma.favoured.update({
            where: { id: favouredId },
            data: payload,
        })

        //Success response!
        if (favoured!=null){
            res={
                status:'success',
                message:'Sweet! Favoured updated!',
                data:favoured,
            };
        }

        return hapi.response(res).code(201);
    } catch (err) {
        console.log(err);
        return hapi.response(res).code(500);
    }
}

//Handle Favoured delete
async function deleteManyHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma }      = request.server.app
    const { favouredIds } = request.payload as any;
    
    const arrayIds = String(favouredIds).split(",").map( Number );

    //Default response
    let res={
        status:'error',
        message:'Warning! Favoured compromised!',
        data:{},
    };

    try {
        //Prisma, put them to rest
        const favouredDeleted = await prisma.favoured.deleteMany({
            where: { id: { in: arrayIds } },
        })

        //Did the deed, show the stick
        if (favouredDeleted!=null){
            res={
                status:'success',
                message: favouredDeleted.count+" favoureds were eliminated successfully",
                data:favouredDeleted
            }
        }

        return hapi.response(res).code(201)
    } catch (err) {
        console.log(err);
        return hapi.response(res).code(500);
    }
}
