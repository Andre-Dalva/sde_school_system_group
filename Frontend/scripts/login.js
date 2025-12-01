const loginButton = document.getElementById("loginButtonForm");
const loginForm = document.getElementById("loginForm");

loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    const loadForm = new FormData(loginForm);
    console.log([...loadForm.entries()]);
})