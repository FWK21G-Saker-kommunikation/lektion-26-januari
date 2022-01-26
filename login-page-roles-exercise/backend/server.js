const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bcryptFunctions = require('./bcrypt');
const { admin, user } = require('./middleware/auth');
const { getAccountByUsername, getAccountByEmail, createAccount,
    updateCookieOnAccount, getAccountByCookie, getAccountsByRole, 
    removeAccount, changePassword } = require('./database/operations');

app.use(express.static('../frontend'));
app.use(express.json());
app.use(cookieParser());

app.post('/api/signup', async (request, response) => {
    const credentials = request.body;
    console.log('----/API/SIGNUP-----');
    // { username: 'Alice', email:'alice@wonderland.com', password: 'pwd123' }
    const resObj = {
        success: true,
        usernameExists: false,
        emailExists: false
    }

    const usernameExists = await getAccountByUsername(credentials.username);
    const emailExists = await getAccountByEmail(credentials.email);
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
        createAccount(credentials);
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

    const account = await getAccountByUsername(credentials.username);
    console.log(account);

    if (account.length > 0) {
        const correctPassword = await bcryptFunctions.comparePassword(credentials.password, account[0].password);
        if (correctPassword) {
            resObj.success = true;

            const cookieId = Math.round(Math.random() * 10000);

            updateCookieOnAccount(credentials.username, cookieId);

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

    const account = await getAccountByCookie(cookie);
    console.log(account);
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

    const account = await getAccountByCookie(cookie);

    if (account.length > 0) {
        resObj.email = account[0].email;
        resObj.role = account[0].role;
    }

    response.json(resObj);
});

app.get('/api/remove', user, (request, response) => {
    const cookie = request.cookies.loggedIn;

    console.log('----/API/REMOVE-----');

    const resObj = {
        success: true
    }

    removeAccount(cookie);

    response.clearCookie('loggedIn');
    response.json(resObj);
});

app.get('/api/user-accounts', admin, async (request, response) => {
    const resObj = {
        success: false,
        accounts: ''
    }

    console.log('----/API/USER-ACCOUNTS-----');

    const userAccounts = await getAccountsByRole('user');

    if (userAccounts.length > 0) {
        resObj.success = true;
        resObj.accounts = userAccounts;
    }

    response.json(resObj);
});

app.post('/api/change-password', admin, async (request, response) => {
    const newPassword = request.body;
    // { password: 'hej123' }
    const cookie = request.cookies.loggedIn;

    const resObj = {
        success: true
    }

    changePassword(cookie, newPassword);    
    
    response.json(resObj);
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});