const BASE_URL = "/";
const local = "/";

function selectMovie(obj) {
  if (!obj.rating || !obj.numRatings) return;
  fetch(`${local}getRecommendation?rating=${obj.rating * 1}&numRatings=${
    obj.numRatings * 1
  }&isbn=${obj.isbn}
       &genres=${obj.genres}&_id=${obj._id}`)
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      data = data.recommendadtion;
      data.forEach((value) => {
        const t = JSON.stringify(value);
        let inputElement = document.createElement("div");
        inputElement.addEventListener("click", () => {
          changeData(value);
        });
        const container = document.querySelector(".container2");
        const papacontainer = document.querySelector(".container");
        let str = htmltemplate(JSON.stringify(value));
        papacontainer.insertBefore(inputElement, container);
        inputElement.insertAdjacentHTML("afterbegin", str);
      });
    });
}
let arr;

window.onload = function () {
  var name = localStorage.getItem("obj");
  arr = JSON.parse(name);
  // Controllers
  console.log(arr);

  function solve(val) {
    let str2 = ` 
             <button class="genre_button">${val}</button>
            `;
    return str2;
  }
  var services = arr.genres;
  services = services.split(",");
  services[0] = services[0].substring(1);
  services[services.length - 1] = services[services.length - 1].substring(
    0,
    services[services.length - 1].length - 1
  );
  services.forEach((x, i) => {
    services[i] = services[i].includes("'")
      ? services[i].replaceAll("'", "").trim()
      : services[i].toLowerCase();
  });
  // console.log(services);
  services.forEach((val) => {
    const gq = document.querySelector(".ge");
    let str = solve(val);
    gq.insertAdjacentHTML("beforebegin", str);
  });

  const title = document.querySelector(".title");
  const des = document.querySelector(".des");
  // const ge= document.querySelector('.ge')
  const year = document.querySelector(".year");
  const votecnt = document.querySelector(".votecnt");
  // const rting = document.querySelector(".rting");
  const run = document.querySelector(".run");
  const leftImg = document.querySelector(".test_img");
  const author = document.querySelector(".author");
  const award = document.querySelector(".award");

  leftImg.src = `${arr.coverImg}`;

  // let x = document.createElement("IMG");
  // x.setAttribute("src", `${arr.coverImg}`);
  // x.setAttribute("width", "304");
  // x.setAttribute("height", "228");
  // x.setAttribute("alt", `${arr.title} Image`);
  // document.querySelector(".left-column").appendChild(x);

  let yr = arr.publishDate;
  title.textContent = `${arr.title}`;
  des.textContent = `${arr.description}`;
  // ge.textContent=`${arr.genres}`;
  run.textContent = `${arr.pages}`;
  year.textContent = `${yr}`;
  // rting.textContent = `ISBN : ${arr.isbn}`;
  votecnt.textContent = `Author : ${arr.author}`;
  author.textContent = ` ⭐ Rating : ${arr.rating} / 10  `;
  award.textContent = `👥 Rated By :  ${arr.numRatings}`;

  selectMovie(arr);
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
