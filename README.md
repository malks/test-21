<h4>Malks Mytest-21</h4>

Hello, and welcome to malks-mytest21!

Let's get to it!

-----
Installation
-----

1) Clone this repository somewhere in your system:

        >git clone https://github.com/malks/test-21.git test

2) Run NPM Install inside the repo folder:

        >cd test;
        >npm install

3) Configure the .env file inside the repo folder with your database parameters, it cannot be SQLite, since we use ENUM on the database =) this has been tested with MySQL.

        It should look like this:

            >DATABASE_URL="mysql://USER:PASS@HOST:PORT/DATABASE"

4) Run Db-up. <b>This will affect your database, so make sure the .env file is pointing you to a new, empty, or otherwise unimportant database</b>
        >npm run db-up

All set!

-----
Testing:
-----
        >npm run test

-----
Starting the server:
-----
        >npm run dev