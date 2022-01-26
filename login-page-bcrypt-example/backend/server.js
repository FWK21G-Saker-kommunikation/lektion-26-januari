const express = require('express');
const cookieParser = require('cookie-parser');
const nedb = require('nedb-promise');
const app = express();
const database = new nedb({ filename: 'accounts.db', autoload: true });

const bcryptFunctions = require('./bcrypt');
console.log(bcryptFunctions)

app.use(express.static('../frontend'));
app.use(express.json());
app.use(cookieParser());


async function admin(request, response, next) {
    const cookie = request.cookies.loggedIn;

    console.log('I ADMIN MIDDLEWARE');

    try {
        const account = await database.find({ cookie: parseInt(cookie) });
        
        //Ifall vi inte hittar något användarkonto
        if (account.length == 0) {
            throw new Error(); //Kommer istället att hoppa till catch
        } else if (account[0].role == 'admin') { //Ifall användarkontot har rollen admin
            next(); //Kommer hoppa vidare till nästa funktionen i route:n
        } else { //I alla andra fall
            throw new Error();
        }
    } catch (error) {
        console.log('Rollen var inte admin, i catch');

        const resObj = {
            success: false,
            errorMessage: 'Unauthorized'
        }

        response.json(resObj);
    }    
}

app.post('/api/signup', async (request, response) => {
    const credentials = request.body;
    console.log('----/API/SIGNUP-----');
    // { username: 'Alice', email:'alice@wonderland.com', password: 'pwd123' }
    const resObj = {
        success: true,
        usernameExists: false,
        emailExists: false
    }

    const usernameExists = await database.find({ username: credentials.username });
    const emailExists = await database.find({ email: credentials.email });

    console.log(usernameExists);
    console.log(emailExists);

    if (usernameExists.length > 0) {
        resObj.usernameExists = true;
    }
    if (emailExists.length > 0) {
        resObj.emailExists = true;
    }

    if(resObj.usernameExists == true || resObj.emailExists == true) {
        resObj.success = false;
    } else {
        if (credentials.username == 'ada') {
            credentials.role = 'admin'
        } else {
            credentials.role = 'user';
        }
        console.log(credentials);
        const hashedPassword = await bcryptFunctions.hashPassword(credentials.password);
        credentials.password = hashedPassword;

        console.log(credentials);
        database.insert(credentials);
    }

    response.json(resObj);
});

app.post('/api/login', async (request, response) => {
    const credentials = request.body;
    // { username: 'Ada', password: 'pwd123' }
    console.log('----/API/LOGIN-----');

    const resObj = {
        success: false
    }

    const account = await database.find({ username: credentials.username });
    console.log(account);

    if (account.length > 0) {
        const correctPassword = await bcryptFunctions.comparePassword(credentials.password, account[0].password);
        if (correctPassword) {
            resObj.success = true;

            const cookieId = Math.round(Math.random() * 10000);

            database.update({ username: credentials.username }, { $set: { cookie: cookieId }});

            response.cookie('loggedIn', cookieId);
        }
    }

    response.json(resObj);
});

app.get('/api/loggedin', async (request, response) => {
    const cookie = request.cookies.loggedIn;

    console.log('----/API/LOGGEDIN-----');

    let resObj = {
        loggedIn: false
    }

    const account = await database.find({ cookie: parseInt(cookie) });

    if (account.length > 0 ) {
        resObj.loggedIn = true;
    }

    response.json(resObj);
});

app.get('/api/logout', (request, response) => {
    response.clearCookie('loggedIn');

    console.log('----/API/LOGOUT-----');

    const resObj = {
        success: true
    }

    response.json(resObj);
});

app.get('/api/account', async (request, response) => {
    const cookie = request.cookies.loggedIn;

    console.log('----/API/ACCOUNT-----');

    const resObj = {
        email: '',
        role: ''
    }

    const account = await database.find({ cookie: parseInt(cookie) });

    if (account.length > 0) {
        resObj.email = account[0].email;
        resObj.role = account[0].role;
    }

    response.json(resObj);
});

app.get('/api/remove', admin, (request, response) => {
    const cookie = request.cookies.loggedIn;

    console.log('----/API/REMOVE-----');

    const resObj = {
        success: true
    }

    database.remove({ cookie: parseInt(cookie)} );

    response.clearCookie('loggedIn');
    response.json(resObj);
});

app.get('/api/user-accounts', admin, async (request, response) => {
    const resObj = {
        success: false,
        accounts: ''
    }

    console.log('----/API/USER-ACCOUNTS-----');

    // multi: true är för att annars får vi bara den första träffen och vi vill ha alla träffar
    // med rollen user
    const userAccounts = await database.find({ role: 'user' });

    if (userAccounts.length > 0) {
        resObj.success = true;
        resObj.accounts = userAccounts;
    }

    response.json(resObj);
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});