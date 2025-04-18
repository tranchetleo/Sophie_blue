//Initializes the login form submission event listener to handle user login.

// check if the user is already logged in
if (sessionStorage.getItem("token")) {
    window.location.href = "index.html";
}
const loginForm = document.getElementById("login");
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) {
        // display the error message
        const error = document.querySelector(".error");
        error.textContent = "Email and password are required";
        return;
    }
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    const data = await response.json();
    // console.log(data);
    if (data.token) {
        // unset the error message
        sessionStorage.setItem("token", data.token);
        const error = document.querySelector(".error");
        error.textContent = "";
        window.location.href = "index.html";
    } else {
        // display the error message
        const error = document.querySelector(".error");
        error.textContent = data.message;
    }
});
