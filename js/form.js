// URL API
const LOGIN_API = 'http://127.0.0.1:5000/login'

// Get Elements 
const formEmail = document.getElementById("form__email")
const inputEmail = document.getElementById("inputEmail")
const button_formEmail = document.getElementById("button_formEmail")
const formPassword = document.getElementById("form__password")
const inputPassword = document.getElementById("inputPassword")
const button_formPassword = document.getElementById("button_formPassword")

// in Case User Click Button [Sign in ] after enter Email
formEmail.addEventListener("submit", (e) => {
    e.preventDefault()
    // Show Input Password
    formEmail.classList.add("form__emailActive")
    formPassword.classList.add("form__passwordActive")
})

// In Case User Click Button [Let's go!] after enter Password
formPassword.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {
        "username": inputEmail.value,
        "password": inputPassword.value
    };

    var jsonData = JSON.stringify(data);

    fetch(LOGIN_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    }).then(response => response.json())
        .then(data => {
            if (data.success === true) {
                // Set Data In local Storage
                localStorage.setItem("Data", JSON.stringify(data.data));
                // Go To Page Tool
                window.location.href = "tool.html"
            } 
            else // In Case Email and Password False
            {
                // Clear Inputs
                inputEmail.value = "";
                inputPassword.value = "";
                // Return Email Input Again
                formEmail.classList.remove("form__emailActive")
                formPassword.classList.remove("form__passwordActive")
                // Show Error
                document.getElementById("error").style.display = "block"
            }
        })
})


