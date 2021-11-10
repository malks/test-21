import Hapi from '@hapi/hapi'

//Handle Banks list
export async function listHandler(request: Hapi.Request, hapi: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app

    const { searchString } = request.query

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
            { id: { contains: searchString } },
        ],
    } : {}

    try {
        //Get the banks
        const banks = await prisma.bank.findMany({
            where: {
                ...search,
            },
        })

        return hapi.response(banks).code(200)

    } catch (err) {
        console.log(err);
        return hapi.response( res ).code(500);
    }
}