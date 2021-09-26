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