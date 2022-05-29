const BASE_URL = "/";

window.onload = function () {
  var name = localStorage.getItem("obj1");
  name = JSON.parse(name);
  console.log(name);
  searchBooks(name);
};

document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelector(".search_button").addEventListener("click", (obj) => {
    const po = document.querySelector(".search_input");
    fetch(`${BASE_URL}getBook?keyword=${po.value}`)
      .then((data) => data.json())
      .then((data) => {
        data = data.books;
        changeData2(data);
        console.log(data);
      });
  });
});
