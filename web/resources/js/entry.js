const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});


function validateSignUpForm() {
    console.log("Starting validate sign up");
    const form = document.getElementById("signUpForm");
    if (form.userName.value == null || form.userName.value.trim() === "") {
        alert("Cannot leave User Name empty");
        form.userName.focus();
        return false;
    }
    if (form.fullName.value == null || form.fullName.value.trim() === "") {
        alert("Cannot leave Name empty");
        form.fullName.focus();
        return false;
    }
    if (form.password.value == null || form.password.value === "") {
        alert("Cannot leave Password empty");
        form.password.focus();
        return false;
    }
    return true;
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
    if (form.password.value === '') {
        console.error("Password is empty");
        form.password.setCustomValidity('Password should not be empty');
    } else {
        form.password.setCustomValidity('');
    }
    return form.reportValidity();
}