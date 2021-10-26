import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
const { afterEach, before, after, describe, it } = exports.lab = Lab.script();
import { init, server } from '../lib/server';

describe('Testing', () => {

    before(async () => {
        await init();
    });

    after(async () => {
        await server.stop();
    });

    afterEach(async () => {
        await server.stop();
    });

    //#######Banks List Testing#########

    it('Bank List All', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/banks/list',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result).to.be.array().and.to.length(4);
    });

    it('Bank List BB', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/banks/list',
            payload: { searchString: "Brasil" },
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result).to.be.array().and.to.part.contain( [ { name: "Banco do Brasil"} ] );
    });


    //########Favoured CREATE Tests#######
    it('Favoured Create Status 400', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:1 }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('Favoured Create Status 201', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { 
                id: 10, 
                name: 'lala lalala', 
                status: 'draft',
                cpf: '703.186.360-00', 
                email: 'lala@lalatest.test.co', 
                account_bank: '001',
                account_agency: '1234', 
                account_number: '12345678', 
                account_number_digit: 'x', 
                account_type: 'easy', 
            }
        });

        const whatever = await server.inject({
            method: 'POST',
            url: '/favoureds/delete',
            payload: { favouredIds: 10 },
        });

        expect(res.statusCode).to.equal(201);

    });



    //########Favoured UPDATE Tests#######
    it('Favoured Update Status 201', async () => {
        const mock = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:12, name: 'lala', cpf: '12312312312', email: 'lala@lalatest.test' }
        });

        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/update/12',
            payload: { name: 'Zzzzz', cpf: '45645645678', email: 'lala@lalatest.test' }
        });

        const whatever = await server.inject({
            method: 'POST',
            url: '/favoureds/delete',
            payload: { favouredIds: 12 },
        });

        expect(res.statusCode).to.equal(201);
        expect(res.result).to.be.object().and.to.part.contain( { name: 'Zzzzz', cpf: '45645645678', email: 'lala@lalatest.test' } );
    });

    it('Favoured Update Status 403', async () => {
        const mock = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:16, name: 'lala', cpf: '12312312312', email: 'lala@lalatest.test', status: 'valid' }
        });

        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/update/16',
            payload: { name: 'Zzzzz', cpf: '45645645678', email: 'lala@lalatest.test' }
        });

        const whatever = await server.inject({
            method: 'POST',
            url: '/favoureds/delete',
            payload: { favouredIds: 16 },
        });

        expect(res.statusCode).to.equal(403);
    });

    it('Favoured VALID Update Status 201', async () => {
        const mock = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:16, name: 'lala', cpf: '12312312312', email: 'lala@lalatest.test', status: 'valid' }
        });
        
        expect(mock.result).be.object().and.part.contain( { id:16, name: 'lala', cpf: '12312312312', email: 'lala@lalatest.test', status: 'valid'  } );

        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/update/16',
            payload: {  email: 'xxx@xxx.xxx' }
        });

        expect(res.statusCode).to.equal(201);
        expect(res.result).be.object().and.part.contain( { id:16, status: 'valid', name: 'lala', email: 'xxx@xxx.xxx' } );
        
        const whatever = await server.inject({
            method: 'POST',
            url: '/favoureds/delete',
            payload: { favouredIds: 16 },
        });

    });



    //########Favoured DELETE Tests#######
    it('Favoured Delete Status 201', async () => {
        const whatever = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:14, name: 'Number Twelve', cpf: '12121212121', email: 'twelve@twelst.tst' }
        });

        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/delete',
            payload: { favouredIds: 14 },
        });

        expect(res.statusCode).to.equal(201);
    });



    //########Favoured LIST Tests#######
    it('Favoured List Status 200', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/list'
        });

        expect(res.statusCode).to.equal(200);
    });

    it('Favoured List Got Alice', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/list'
        });

        expect(res.result).to.be.an.array().and.to.part.contain( [ { name:'Alice' } ] );
    });

    it('Favoured List No Alice', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/list?skip=1',
        });

        expect(res.result).to.be.an.array().and.to.part.not.contain( [ { name:'Alice' } ] );
    });

    it('Favoured List Take 5', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/list?take=5',
        });
        
        expect(res.result).to.be.an.array().and.length(5);
    });

    it('Favoured List CPF 7777777777', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/list?searchString=7777777777&take=1',
        });

        expect(res.result).to.be.an.array().and.length(1).and.to.part.contain( [ { cpf:'7777777777' } ] );
    });

    it('Favoured List Order Desc', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/list?orderDirection=desc&take=1',
        });
        
        expect(res.result).to.be.an.array().and.length(1);
    });
    
});
