import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

//Pre-registered Favoureds
const favouredData: Prisma.FavouredCreateInput[] = [
    {
        name: 'Alice',
        email: 'alice@test.tst',
        cpf: '1111111111',
        status: 'valid',
        account_bank: '237',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'Alain',
        email: 'alain@test.tst',
        cpf: '2222222222',
        status: 'draft',
        account_bank: '237',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'Alan',
        email: 'alan@test.tst',
        cpf: '333333333',
        status: 'draft',
        account_bank: '237',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'Alex',
        email: 'alex@test.tst',
        cpf: '44444444444',
        status: 'draft',
        account_bank: '001',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'Setembrino',
        email: 'setembrino@test.tst',
        cpf: '555555555',
        status: 'draft',
        account_bank: '001',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'Josberto',
        email: 'josberto@test.tst',
        cpf: '666666666',
        status: 'draft',
        account_bank: '001',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'Maricota',
        email: 'maricota@test.tst',
        cpf: '7777777777',
        status: 'valid',
        account_bank: '001',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'favorecido',
        email: 'favorecido@test.tst',
        cpf: '8888888888',
        status: 'draft',
        account_bank: '001',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'Peter Parker',
        email: 'parker@test.tst',
        cpf: '9999999999',
        status: 'draft',
        account_bank: '001',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
    {
        name: 'Moss',
        email: 'moss@test.tst',
        cpf: '0000000000',
        status: 'draft',
        account_bank: '001',
        account_agency: '1234',
        account_agency_digit: '1',
        account_type: 'savings',
        account_number: '123456',
        account_number_digit: '2',
    },
]

//Banks
const bankData: Prisma.BankCreateInput[] = [
    {
        id: '001',
        name: 'Banco do Brasil',
    },
    {
        id: '104',
        name: 'Caixa Economica Federal',
    },
    {
        id: '237',
        name: 'Bradesco ',
    },
    {
        id: '756',
        name: 'Sicoob',
    },
]

//Seed the seeds
async function main() {
    console.log(`Seeding ...`)
    for (const f of favouredData) {
        const favoured = await prisma.favoured.create({
            data: f,
        })
        console.log(`Created favoured with id: ${favoured.id}`)
    }
    for (const b of bankData) {
        const bank = await prisma.bank.create({
            data: b,
        })
        console.log(`Created bank with id: ${bank.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })