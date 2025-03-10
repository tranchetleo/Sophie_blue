function main() {
  getWorks();
  addFilters();
}

main();

function createWorksCard(work) {
  // create a figure element for each work
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  figure.dataset.category = work.category.name; 
  img.src = work.imageUrl;
  img.alt = work.title;
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

function getWorks() {
  // fetch the data from the API at http://localhost:5678/api/works
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((work) => createWorksCard(work));
    })
    .catch((error) => console.error(error));
  //@TODO: utiliser await
}

function addActiveClass(button) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  button.classList.add("active");
}

function createCategoryFilterButton(category) {
  // create a category filter button for each category
  const filters = document.querySelector(".filters");
  const button = document.createElement("button");
  const gallery = document.querySelector(".gallery");
  button.textContent = category.name;
  button.dataset.category = category.name;
  button.addEventListener("click", (event) => {
    const category = event.target.dataset.category;
    const figures = gallery.querySelectorAll("figure");
    figures.forEach((figure) => {
      if (figure.dataset.category === category) {
        figure.style.display = "block";
      } else {
        figure.style.display = "none";
      }
    });
    addActiveClass(button);
  });
  filters.appendChild(button);
}

function createAllCategoryFilterButton() {
  const filters = document.querySelector(".filters");
  const button = document.createElement("button");
  button.textContent = "Tous";
  button.addEventListener("click", () => {
    const figures = document.querySelectorAll("figure");
    figures.forEach((figure) => {
      figure.style.display = "block";
    });
    addActiveClass(button);
  });
  filters.appendChild(button);
}

function addFilters() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      createAllCategoryFilterButton();
      data.forEach((category) => createCategoryFilterButton(category));
    })
    .catch((error) => console.error(error));
}
