// Get Elements 
const formEmail = document.getElementById("form__email")
const inputEmail = document.getElementById("inputEmail")
const button_formEmail = document.getElementById("button_formEmail")
const formPassword = document.getElementById("form__password")
const inputPassword = document.getElementById("inputPassword")
const button_formPassword = document.getElementById("button_formPassword")

formEmail.addEventListener("submit" ,(e) => {
    e.preventDefault();
    formEmail.classList.add("form__emailActive")
    formPassword.classList.add("form__passwordActive")
})

formPassword.addEventListener("submit" , (e) => {
    e.preventDefault();
    if(inputEmail.value === "admin@admin.com"  && inputPassword.value === "123456789") {
        window.location.href = "project.html"
    }else {
        inputEmail.value = "";
        inputPassword.value = "";
        formEmail.classList.remove("form__emailActive")
        formPassword.classList.remove("form__passwordActive")
        document.getElementById("error").style.display = "block"
    }
})