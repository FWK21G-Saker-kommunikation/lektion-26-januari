const logoutButton = document.querySelector('#logout-button');
const emailElem = document.querySelector('#email');
const removeButton = document.querySelector('#remove-button');

async function isLoggedIn() {
    const response = await fetch('http://localhost:5000/api/loggedin');
    const data = await response.json();

    console.log(data);

    if (data.loggedIn == false) {
        window.location.href = 'http://localhost:5000/';
    } 
}

async function logout() {
    const response = await fetch('http://localhost:5000/api/logout');
    const data = await response.json();
    console.log(data);

    if (data.success) {
        window.location.href = 'http://localhost:5000/';
    }
}

async function getAccountInformation() {
    const response = await fetch('http://localhost:5000/api/account');
    const data = await response.json();

    console.log(data);
    emailElem.innerHTML = `E-post: ${data.email}`;

    if (data.role == 'admin') {
        getUserAccounts();
    }
}

async function removeAccount() {
    const response = await fetch('http://localhost:5000/api/remove');
    const data = await response.json();

    console.log(data);
    if (data.success) {
        window.location.href = 'http://localhost:5000/';
    }
}

async function getUserAccounts() {
    const response = await fetch('http://localhost:5000/api/user-accounts');
    const data = await response.json();

    console.log(data);
}

logoutButton.addEventListener('click', () => {
    logout();
});

removeButton.addEventListener('click', () => {
    removeAccount();
});;

isLoggedIn();
getAccountInformation();