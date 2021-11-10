import Hapi from '@hapi/hapi'

export async function listHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app

    const { searchString, skip, take, orderDirection } = request.query

    let res={
        status:'error',
        message:'Oops, something went terribly wrong...',
        data:{},
    };

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
        console.log(err);
        return hapi.response(res).code(500);
    }
}  

export async function createHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;
    const payload    = request.payload as any;

    let res={
        status:'error',
        message:'Warning! Favoured compromised!',
        data:{},
    };

    try {
        const createdFavoured = await prisma.favoured.create({
            data: payload,
        })

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

export async function updateHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app;

    const favouredId = Number(request.params.favouredId)
    const payload    = request.payload as any;

    let res={
        status:'error',
        message:'Warning! Update action compromised!',
        data:{},
    };

    try {
        const checkFavoured = await prisma.favoured.findFirst({
            where: { id: favouredId}
        })

        if (checkFavoured!=null && checkFavoured.status=='valid' && ( Object.keys(payload).length>1 || ( Object.keys(payload).length==1 && payload.email==null) ) ){
            return hapi.response( res ).code(402);
        }

        const favoured = await prisma.favoured.update({
            where: { id: favouredId },
            data: payload,
        })

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

export async function deleteManyHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma }      = request.server.app
    const { favouredIds } = request.payload as any;
    
    const arrayIds = String(favouredIds).split(",").map( Number );

    let res={
        status:'error',
        message:'Warning! Favoured compromised!',
        data:{},
    };

    try {
        const favouredDeleted = await prisma.favoured.deleteMany({
            where: { id: { in: arrayIds } },
        })

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
