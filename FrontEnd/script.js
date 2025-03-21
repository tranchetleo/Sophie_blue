function main() {
  isLogged();
}

main();

function isLogged() {
  var login = document.getElementById("loginLink");
  if (sessionStorage.getItem("token")) {
    // change the login button to logout
    login.textContent = "logout";
  } else {
    // change the logout button to login
    login.textContent = "login";
  }
}
