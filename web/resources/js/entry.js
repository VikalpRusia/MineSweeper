const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const userName = document.querySelector('#userName');
const userNameSuggestion = document.querySelector('#userNameSuggestion');
const submitSignUpButton = document.querySelector('#submitSignUpButton');

submitSignUpButton.disabled = true;
userName.addEventListener("keyup", () => {
    console.log('Key down on username', userName.value);
    checkUserNameExists(userName.value).then(resp => {
        if (resp.present === true) {
            userNameSuggestion.classList.add('error');
            submitSignUpButton.disabled = true;
            userNameSuggestion.innerHTML = "Username already taken"
        } else {
            userNameSuggestion.classList.remove('error');
            submitSignUpButton.disabled = false;
            userNameSuggestion.innerHTML = "Username available";
        }
    }).catch(err => console.log(err));
});
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

function validateSignUpForm() {
    console.log("Starting validate sign up");
    const form = document.getElementById("signUpForm");
    console.log(form.userName.value);
    console.log(form.fullName.value);
    console.log(form.password.value);
    const regex = /[\s]+/;
    if (form.userName.value == null || form.userName.value === '') {
        console.error("User Name should not be empty");
        form.userName.setCustomValidity('User Name should not be empty');
    } else if (regex.test(form.userName.value)) {
        console.error("User Name should not contain spaces");
        form.userName.setCustomValidity('User Name should not contain spaces');
    } else {
        form.userName.setCustomValidity('');
    }
    if (form.fullName.value == null || form.fullName.value.trim() === '') {
        console.error("Name is empty");
        form.fullName.setCustomValidity('Please provide your Name !');
    } else {
        form.fullName.setCustomValidity('');
    }
    if (form.password.value == null || form.password.value === '') {
        console.error("Password is empty");
        form.password.setCustomValidity('Password should not be empty');
    } else {
        form.password.setCustomValidity('');
    }
    return form.reportValidity();
}


function validateSignInForm() {
    console.log("Starting validation of sign in form");
    const form = document.getElementById("signInForm");
    console.log(form.userName.value);
    console.log(form.password.value);
    const regex = /[\s]+/;
    if (form.userName.value == null || form.userName.value === '') {
        console.error("User Name should not be empty");
        form.userName.setCustomValidity('User Name should not be empty');
    } else if (regex.test(form.userName.value)) {
        console.error("User Name should not contain spaces");
        form.userName.setCustomValidity('User Name should not contain spaces');
    } else {
        form.userName.setCustomValidity('');
    }
    if (form.password.value == null || form.password.value === '') {
        console.error("Password is empty");
        form.password.setCustomValidity('Password should not be empty');
    } else {
        form.password.setCustomValidity('');
    }
    if (form.reportValidity()) {
        verifyLogIn(form.userName.value, form.password.value).then(resp => {
            console.log(resp);
            if (resp.validUser === true) {
                window.location = "home";
            } else {
                alert("Invalid Username or password")
            }
        }).catch(error => console.log(error));
    }
    return false;
}

async function verifyLogIn(userName, password) {
    return await fetch("verify-log-in", {
        method: "POST",
        headers: {
            "charset": "UTF-8",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            userName: userName,
            password: password
        })
    })
        .then(data => data.json());
}

async function checkUserNameExists(userName) {
    return await fetch("sign-up-form/is-username-available", {
        method: "POST",
        headers: {
            "charset": "UTF-8",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            userName: userName,
        })
    })
        .then(data => data.json());
}