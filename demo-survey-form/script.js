const form = document.getElementById("survey-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thanks for trying out the form!");
  location.reload();
});
