import Hapi from '@hapi/hapi'
import { listHandler as listBank } from './plugins/banks'
import { listHandler as listFavoured } from './plugins/favoureds'
import { createHandler as createFavoured } from './plugins/favoureds'
import { updateHandler as updateFavoured } from './plugins/favoureds'
import { deleteManyHandler as deleteManyFavoured } from './plugins/favoureds'

import joi from 'joi';
import createValidator from './plugins/validators/favoured-create';
import updateValidator from './plugins/validators/favoured-update';

export const favouredsPlugin = {
    name: 'app/favoureds',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/favoureds/list',
                handler: listFavoured,
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/create',
                handler: createFavoured,
                options: {
                    validate: {
                        payload: createValidator,
                    },
                },
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/update/{favouredId}',
                handler: updateFavoured,
                options: {
                    validate: {
                        payload: updateValidator
                    },
                    response:{
                        failAction: 'error'
                    },
                }
            },
        ]),
        server.route([
            {
                method: 'POST',
                path: '/favoureds/delete',
                handler: deleteManyFavoured,
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

export const banksPlugin = {
    name: 'app/banks',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/banks/list',
                handler: listBank,
            },
        ])
    }
}