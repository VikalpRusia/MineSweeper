const sign_in_btn = $("#sign-in-btn");
const sign_up_btn = $("#sign-up-btn");
const container = $(".container");
const userName = $('#userName');
const userNameSuggestion = $('#userNameSuggestion');
const submitSignUpButton = $('#submitSignUpButton');
const signUpForm = $('#signUpForm');

signUpForm.submit((event) => {
    event.preventDefault();
    console.log(event);
    if (signUpForm.get(0).reportValidity()) {
        submitSignUpForm(signUpForm).then(() => {
            alert("You are now registered !");
            sign_in_btn.click();
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }
});
submitSignUpButton.disabled = true;
userName.keyup(() => {
    console.log('Key down on username', userName.val());
    checkUserNameExists(userName.val()).then(resp => {
        if (resp.present === true) {
            userNameSuggestion.addClass('error');
            submitSignUpButton.disabled = true;
            userNameSuggestion.html("Username already taken");
        } else {
            userNameSuggestion.removeClass('error');
            submitSignUpButton.disabled = false;
            userNameSuggestion.html("Username available");
        }
    }).catch(err => {
        console.log(err);
        alert(err);
    });
});
sign_up_btn.click(() => {
    container.addClass("sign-up-mode");
});

sign_in_btn.click(() => {
    container.removeClass("sign-up-mode");
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

async function submitSignUpForm(form) {
    return await fetch(form.attr('action'), {
        method: "POST",
        headers: {
            "charset": "UTF-8",
            "Content-type": "application/x-www-form-urlencoded"
        },
        body: form.serialize()
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