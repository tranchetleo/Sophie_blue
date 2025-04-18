function main() {
  isLogged();
  openEditionModal();
  closeEditionModal();
  addPhotoUploadListener();
  addPhotoSubmitListener();
}

main();

/**
 * Updates the login/logout button and the visibility of the edition mode button based on the user's authentication status stored in sessionStorage.
 */
function isLogged() {
  var login = document.getElementById("loginLink");
  var edition_mode = document.getElementById("edition-mode");
  if (sessionStorage.getItem("token")) {
    // change the login button to logout
    login.textContent = "logout";
    // add event listener to logout
    login.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("token");
      window.location.href = "index.html";
    });
    // show the edition button
    edition_mode.style.display = "flex";
  } else {
    // change the logout button to login
    login.textContent = "login";
    // add event listener to login
    login.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "login.html";
    });
    // hide the edition button
    edition_mode.style.display = "none";
  }
}

// EDITION MODAL

/**
 * Initializes the event listener for the "edition-mode" button to open the edition modal.
 */
function openEditionModal() {
  var edition_button = document.getElementById("edition-mode");
  edition_button.addEventListener("click", async (event) => {
    event.preventDefault();
    var modal = document.getElementById("edition-modal");
    modal.style.display = "flex";
    showGallery();
  });
}

/**
 * Closes the edition modal when triggered by either the close button or clicking outside the modal.
 */
function closeEditionModal() {
  var modal = document.getElementById("edition-modal");
  var close_button = document.getElementById("close");
  close_button.addEventListener("click", (event) => {
    event.preventDefault();
    var modal = document.getElementById("edition-modal");
    modal.style.display = "none";
    hideAddPhoto();
    hideGallery();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      hideAddPhoto();
      hideGallery();
    }
  });
}

// GALLERY SECTION

/**
 * Displays the gallery by fetching images from the server and populating the gallery section with the retrieved data.
 */
function showGallery() {
  var gallery_div = document.getElementById("edit-gallery");
  var photo_div = document.getElementById("photos");
  photo_div.innerHTML = "";
  // get the images from the server
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((work) => addWorkToEditGallery(work, photo_div));
    })
    .catch((error) => console.error(error));
  //@TODO: utiliser await

  // AddImage button
  var button = document.getElementById("add-photo-btn");
  button.addEventListener("click", showAddPhoto);

  gallery_div.style.display = "flex";
}

/**
 * Adds a work item to the edit gallery by creating a figure element with an image and a delete icon.
 *
 * @param {Object} work - The work object containing details about the item.
 * @param {HTMLElement} photo_div - The parent container where the figure element will be appended.
 */
function addWorkToEditGallery(work, photo_div) {
  var figure = document.createElement("figure");
  var img = document.createElement("img");
  // create icone delete
  var delete_icon = document.createElement("i");
  delete_icon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
  delete_icon.addEventListener("click", async (event) => {
    event.preventDefault();
    if ((await deletePhoto(work.id)).ok) {
      figure.remove();
      const mainGallery = document.querySelector(".gallery");
      const figureToRemove = mainGallery.querySelector('#id'+work.id);
      if (figureToRemove) {
        figureToRemove.remove();
      }
    } else {
      // display the error message
      const error = document.querySelector(".delete-error");
      error.textContent = "Error deleting photo";
    }
  });
  figure.appendChild(delete_icon);
  img.src = work.imageUrl;
  figure.appendChild(img);
  photo_div.appendChild(figure);
}

/**
 * Hides the gallery section by setting its display style to "none".
 */
function hideGallery() {
  var gallery_div = document.getElementById("edit-gallery");
  gallery_div.style.display = "none";

  // remove the error message
  const error = document.querySelector(".delete-error");
  error.textContent = "";
}

/**
 * Deletes a photo by its ID from the server.
 *
 * @param {number|string} id - The ID of the photo to be deleted.
 */
function deletePhoto(id) {
  return fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      id: id,
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    }),
  });
}

// ADD PHOTO SECTION

/**
 * Displays the "Add Photo" section and populates the category dropdown with data fetched from the server.
 */
function showAddPhoto() {
  var select = document.getElementById("category");
  select.innerHTML = "";
  // get the categories from the server
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((category) => addCategoryToSelect(category, select));
    })
    .catch((error) => console.error(error));
  var add_photo = document.getElementById("add-photo");
  add_photo.style.display = "flex";
  hideGallery();
}

/**
 * Adds a category as an option to a given select element.
 *
 * @param {Object} category - The category object to add.
 * @param {HTMLSelectElement} select - The select element to which the category will be added.
 */
function addCategoryToSelect(category, select) {
  var option = document.createElement("option");
  option.value = category.id;
  option.textContent = category.name;
  select.appendChild(option);
}

/**
 * Hides the "Add Photo" section by setting its display style to "none" and clears the input fields for title, category, and image.
 */
function hideAddPhoto() {
  var add_photo = document.getElementById("add-photo");
  add_photo.style.display = "none";

  // clear the form
  var title = document.getElementById("title");
  var category = document.getElementById("category");
  var image = document.getElementById("image");
  var error = document.querySelector(".error");
  title.value = "";
  category.value = "";
  image.value = "";
  error.textContent = "";
  // remove the preview image
  var preview = document.getElementsByClassName("preview")[0];
  preview.src = "";
  preview.style.display = "none";
}

/**
 * Adds an event listener to the image input field to handle file selection.
 */
function addPhotoUploadListener() {
  var image_input = document.getElementById("image");
  image_input.addEventListener("change", (event) => {
    var file = event.target.files[0];
    var preview = document.getElementsByClassName("preview")[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    } else {
      preview.src = "";
      preview.style.display = "none";
    }
  });
}

/**
 * Adds an event listener to the submit button for the photo upload form.
 */
function addPhotoSubmitListener() {
  var submit_button = document.getElementById("submitWork");
  submit_button.addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const categoryID = document.getElementById("category").value;
    const categoryName = document.getElementById("category").options[document.getElementById("category").selectedIndex].textContent;
    const image = document.getElementById("image").files[0];
    submitPhoto(title, categoryID, image, categoryName);
  });
}

/**
 * Submits a photo along with its title and category to the server.
 */
function submitPhoto(title, category, image, categoryName) {
  if (!title || !category || !image) {
    // display the error message
    const error = document.querySelector(".error");
    error.textContent = "Title, category and image are required";
    return;
  }
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      hideAddPhoto();
      showGallery();
      work = {
        id: data.id,
        imageUrl: data.imageUrl,
        title: data.title,
        category: {
          id: category,
          name: categoryName,
        },
      }
      createWorksCard(work);
    })
    .catch((error) => console.error(error));
}