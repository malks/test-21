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

