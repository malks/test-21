import Hapi from '@hapi/hapi'
import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
const { afterEach, before, after, describe, it } = exports.lab = Lab.script();
import { init } from '../lib/server';

describe('Testing', () => {
    let server: Hapi.Server = new Hapi.Server;

    before(async () => {
        server = await init();
    });

    //#######Banks List Testing#########

    //List All Banks
    it('Bank List All', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/banks/list',
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result).to.be.array().and.to.length(4);
    });

    //List Banco do Brasil Only
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

    //Forbidden favoured creation
    it('Favoured Create Status 400', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:1 }
        });

        expect(res.statusCode).to.equal(400);
    });

    //Favoured creation
    it('Favoured Create Status 201', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { 
                id: 99, 
                name: 'lala lalala', 
                cpf: '703.186.360-00', 
                email: 'lala@lalatest.test.co', 
                account_bank: '001',
                account_agency: '1234', 
                account_number: '12345678', 
                account_number_digit: 'x', 
                account_type: 'CONTA_FACIL', 
            }
        });

        const whatever = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '99' }
        });

        expect(res.statusCode).to.equal(201);

    });

    //Wrong Favoured Account Caught on Validation
    it('Favoured Create Account Wrong', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:99, name: 'lala', email: 'lala@lalatest.test.co',  account_number:'lalala' }
        });

        const whatever = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '99' },
        });

        expect(res.statusCode).to.equal(400);
    });


    //Favoured BB Account created
    it('Favoured Create Account BB 201', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:99, name: 'lala abc', cpf:'452.273.330-50' , email: 'lala@lalatest.tst.co',  account_type:'CONTA_CORRENTE', account_agency:'0198', account_agency_digit:'x', account_bank:'001', account_number:'1234', account_number_digit:'x' }
        });

        const whatever = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '99' },
        });

        expect(res.statusCode).to.equal(201);
    });

    //Favoured Not BB Account Creation Forbidden by Validation (digit x)
    it('Favoured Create Account NOT BB 400', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:99, name: 'lala abc', cpf:'452.273.330-50' , email: 'lala@lalatest.tst.co', account_type:'CONTA_CORRENTE', account_agency:'0198', account_agency_digit:'x', account_bank:'237', account_number:'1234', account_number_digit:'x' }
        });

        const whatever = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '99' },
        });

        expect(res.statusCode).to.equal(400);
    });


    //########Favoured UPDATE Tests#######

    //Update Favoured
    it('Favoured Update Status 201', async () => {
        const mock = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { 
                id: 99, 
                name: 'lala lalala', 
                cpf: '703.186.360-00', 
                email: 'lala@lalatest.test.co', 
                account_bank: '001',
                account_agency: '1234', 
                account_number: '12345678', 
                account_number_digit: 'x', 
                account_type: 'CONTA_FACIL', 
             }
        });

        const res = await server.inject({
            method: 'PUT',
            url: '/favoureds/update/99',
            payload: { name: 'Zzzzz zaza', cpf: '870.180.390-53', email: 'lala@lalatest.test.tst' }
        });

        const whatever = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '99' },
        });

        expect(res.statusCode).to.equal(201);
        expect(res.result).to.be.object().and.to.part.contain( { data : { name: 'Zzzzz zaza', cpf: '870.180.390-53', email: 'lala@lalatest.test.tst' } } );
    });

    //Update favoured Forbidden
    it('Favoured Update Status 400', async () => {
        const mock = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:99, name: 'lala', cpf: '12312312312', email: 'lala@lalatest.test' }
        });

        const res = await server.inject({
            method: 'PUT',
            url: '/favoureds/update/99',
            payload: { name: 'Zzzzz', cpf: '45645645678', email: 'lala@lalatest.test' }
        });

        const whatever = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '99' },
        });

        expect(res.statusCode).to.equal(400);
    });


    //Update Favoured Account, but wrong value, caught by validator
    it('Favoured Update Account Wrong', async () => {
        const mock = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:16, name: 'lala', email: 'lala@lalatest.test.co' }
        });

        const res = await server.inject({
            method: 'PUT',
            url: '/favoureds/update/16',
            payload: {  account_number:'lalala' }
        });

        const whatever = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '16' },
        });

        expect(res.statusCode).to.equal(400);
    });

    
    //Valid Favoured update email
    it('Favoured VALID Update Status 201', async () => {        
        const res = await server.inject({
            method: 'PUT',
            url: '/favoureds/update/1',
            payload: {  email: 'xxx@xxx.xxx.xx' }
        });

        const whatever = await server.inject({
            method: 'PUT',
            url: '/favoureds/update/1',
            payload: { email: 'alice@test.tst' },
        });


        expect(res.statusCode).to.equal(201);
        expect(res.result).be.object().and.part.contain( { data: { id:1, name: 'Alice', email: 'xxx@xxx.xxx.xx' } } );
        
    });



    //########Favoured DELETE Tests#######
    it('Favoured Delete Status 201', async () => {
        const whatever = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:99, name: 'Number Twelve', cpf: '12121212121', email: 'twelve@twelst.tst' }
        });

        const res = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '99' },
        });

        expect(res.statusCode).to.equal(201);
    });



    //########Favoured LIST Tests#######
    it('Favoured List Status 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/favoureds/list'
        });

        expect(res.statusCode).to.equal(200);
    });

    it('Favoured List Got Alice', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/favoureds/list'
        });

        expect(res.result).to.be.an.array().and.to.part.contain( [ { name:'Alice' } ] );
    });

    it('Favoured List No Alice', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/favoureds/list?skip=1',
        });

        expect(res.result).to.be.an.array().and.to.part.not.contain( [ { name:'Alice' } ] );
    });

    it('Favoured List Take 5', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/favoureds/list?take=5',
        });
        
        expect(res.result).to.be.an.array().and.length(5);
    });

    it('Favoured List CPF 777.777.777-77', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/favoureds/list?searchString=777.777.777-77&take=1',
        });

        expect(res.result).to.be.an.array().and.length(1).and.to.part.contain( [ { cpf:'777.777.777-77' } ] );
    });

    it('Favoured List Order Desc', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/favoureds/list?orderDirection=desc&take=1',
        });
        
        expect(res.result).to.be.an.array().and.length(1);
    });
    


    //############### INTEGRATION TEST #############
    
    it('Integration', async () => {
        //Add favoured
        const create = await server.inject({
            method: 'POST',
            url: '/favoureds/create',
            payload: { id:99, name: 'lala abc', cpf:'452.273.330-50' , email: 'lala@lalatest.tst.co',  account_type:'CONTA_CORRENTE', account_agency:'0198', account_agency_digit:'1', account_bank:'237', account_number:'1234', account_number_digit:'1' }
        });

        //Check favoured on the database
        const list = await server.inject({
            method: 'GET',
            url: '/favoureds/list?searchString=452.273.330-50&take=1',
        });

        //Update favoured
        const update = await server.inject({
            method: 'PUT',
            url: '/favoureds/update/99',
            payload: { name: 'Zzzzz zaza', cpf: '870.180.390-53', email: 'lala@lalatest.test.tst' }
        });

        //Update it again, this time it crashes, status can't be updated to valid
        const again = await server.inject({
            method: 'PUT',
            url: '/favoureds/update/99',
            payload: { name: 'vvvvvvvv', email: 'again@change.it.co', status: 'valid' }
        });

        //Erase it
        const erase = await server.inject({
            method: 'DELETE',
            url: '/favoureds/delete',
            payload: { favouredIds: '99' },
        });

        //Make sure it's gone
        const check = await server.inject({
            method: 'GET',
            url: '/favoureds/list?searchString=870.180.390-53&take=1',
        });

        //Add favoured
        expect(create.statusCode).to.equal(201);

        //Check favoured on the database
        expect(list.statusCode).to.equal(200);
        expect(list.result).to.be.an.array().and.length(1).and.to.part.contain( [ { name: 'lala abc', cpf:'452.273.330-50' , email: 'lala@lalatest.tst.co' } ] );

        //Update favoured
        expect(update.statusCode).to.equal(201);
        expect(update.result).to.be.an.object().and.to.part.contain( { data : { name: 'Zzzzz zaza', cpf: '870.180.390-53', email: 'lala@lalatest.test.tst', status:'draft', account_type:'CONTA_CORRENTE', account_agency:'0198' } } );

        //Update it again, this time it crashes, status can't be updated to valid
        expect(again.statusCode).to.equal(400);

        //Erase it
        expect(erase.statusCode).to.equal(201);
        expect(erase.result).to.be.an.object().and.to.part.contain( { data : { count: 1 } } );

        //Make sure it's gone
        expect(check.statusCode).to.equal(200);
        expect(check.result).to.be.an.array().and.to.length(0);
    });

});
