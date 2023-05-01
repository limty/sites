(function () {
  var navbarBurger = document.querySelector(".navbar-burger");
  var menu = document.querySelector("#" + navbarBurger.dataset.target);
  if (navbarBurger !== null) {
    navbarBurger.addEventListener("click", function () {
      navbarBurger.classList.toggle("is-active");
      menu.classList.toggle("is-active");
    });
  }
})();
