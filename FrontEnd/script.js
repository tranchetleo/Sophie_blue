function main() {
  isLogged();
  openEditionModal();
}

main();

function isLogged() {
  var login = document.getElementById("loginLink");
  var edition_mode = document.getElementById("edition-mode");
  if (sessionStorage.getItem("token")) {
    // change the login button to logout
    login.textContent = "logout";
    // show the edition button
    edition_mode.style.display = "flex";
  } else {
    // change the logout button to login
    login.textContent = "login";
    // hide the edition button
    edition_mode.style.display = "none";
  }
}

function openEditionModal() {
  var edition_button = document.getElementById("edition-mode");
  edition_button.addEventListener("click", async (event) => {
    event.preventDefault();
    var modal = document.getElementById("edition-modal");
    modal.style.display = "block";
  });
}
