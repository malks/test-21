<h2>Malks Mytest-21</h2>

Hello, and welcome to malks-mytest21!

Let's get to it!

----------
<h4>Installation</h4>

1) Clone this repository somewhere in your system:
    >git clone https://github.com/malks/test-21.git test

2) Run NPM Install inside the repo folder:

    >cd test

    >npm install

3) Configure the .env file inside the repo folder with your database parameters, it cannot be SQLite, since we use ENUM on the database =) this has been tested with MySQL.

    It should look like this:

    > DATABASE_URL="mysql://USER:PASS@HOST:PORT/DATABASE"

4) Run Db-up. 
    <b>IMPORTANT:</b> This will affect your database, so make sure the .env file is pointing you to a new, empty, or otherwise unimportant database<
    >npm run db-up

All set!

----------
<h4>Testing</h4>

    >npm run test

----------
<h4>Starting the server</h4>

    >npm run dev

The server will run on <b>localhost:3000</b>

Examples:

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


<b>Thank you!</b>