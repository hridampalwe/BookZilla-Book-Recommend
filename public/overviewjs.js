const BASE_URL = "/";

window.onload = function () {
  getBooks();
};
// document.body.onload =

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

function getBooks() {
  fetch(`${BASE_URL}getAllBooks`)
    .then((data) => data.json())
    .then((data) => {
      data = data.booksListdata;
      console.log(data);
      data.forEach((value) => {
        // movieList[value._id] = value;
        const t = JSON.stringify(value);
        var inputElement = document.createElement("div");
        inputElement.addEventListener("click", () => {
          changeData(value);
        });
        // const currentDiv = document.getElementsByClassName(".container2");
        const container = document.querySelector(".container2");
        const papacontainer = document.querySelector(".container");
        let str = htmltemplate(t);
        papacontainer.insertBefore(inputElement, container);
        inputElement.insertAdjacentHTML("afterbegin", str);
      });
    });
}
