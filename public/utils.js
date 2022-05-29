const changeData = (value) => {
  console.log("HI");
  let p = JSON.stringify(value);
  localStorage.setItem("obj", p);
  location.href = "/details.html";
};
const changeData2 = (value) => {
  // console.log("HI");
  let p = JSON.stringify(value);
  localStorage.setItem("obj1", p); // Pair  key : value
  location.href = "/search.html";
};

function htmltemplate(value) {
  const po = value;
  value = JSON.parse(value);
  let name = value.title;
  let img = value.coverImg;

  let str2 = `<div class="card" onclick="" style="
    background: url(${img})
      100% 100%;
    background-size: cover;
    ">
    <div class="box" >
      <div class="content">
        <h3>${name}</h3>
        <p>
          ${value.author}
        </p>
        <a href="#">View More</a>
      </div>
    </div>
  </div>`;
  return str2;
}

function searchBooks(data) {
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
}
