let name1 = document.querySelector(".name");
let surname = document.querySelector(".surname");
let phone = document.querySelector(".phone");
let weekly = document.querySelector(".weekly");
let monthly = document.querySelector(".monthly");
let btnCreate = document.querySelector(".btn-create");
// saltanat sent js document
let list = document.querySelector(".list");

const API = "http://localhost:8000/contactBook";

let obj = {};

btnCreate.addEventListener("click", () => {
  if (
    !name1.value.trim() ||
    !surname.value.trim() ||
    !phone.value.trim() ||
    !weekly.value.trim() ||
    !monthly.value.trim()
  ) {
    alert("заполните поле");
    return;
  }
  obj = {
    name: name1.value,
    surname: surname.value,
    phone: phone.value,
    weekly: weekly.value,
    monthly: monthly.value,
  };

  name1.value = "";
  surname.value = "";
  phone.value = "";
  weekly.value = "";
  monthly.value = "";

  console.log(obj);

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  // render();
  // deleted();
  render();
});

async function render() {
  let res = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=3`);
  let contactBook = await res.json();

  drawPaginationButtons();

  list.innerHTML = "";
  console.log(contactBook);
  contactBook.forEach((item) => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML += `<div class="card" style="width: 16rem ;">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz9MCWyGSFypDUCb-QlUVQ6tygaFwLJzHrRw&usqp=CAU" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">Students</h5>
      <p class="card-text">${item.name}</p>
      <p>${item.surname}</p>
      <p>${item.phone}</p>
      <p>${item.weekly}</p>
      <p>${item.monthly}</p>
    </div>
    <div>
    <button  onclick="deleted(${item.id})" class="btn btn-danger">delete</button>
    <button onclick="btnSaveEdit(${item.id})" class="btn btn-warning btn-edit " data-bs-toggle="modal" data-bs-target="#exampleModal">edit</button>
    </div>

  </div>
        </li>
        `;

    list.append(newElem);
  });
}

render();
async function deleted(id) {
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    render();
  } catch (error) {
    console.log(error);
  }
}
// EDIT
let inpEdit = document.querySelector(".inp-edit");
let inpEdit1 = document.querySelector(".inp-edit1");
let inpEdit2 = document.querySelector(".inp-edit2");
let inpEdit3 = document.querySelector(".inp-edit3");
let inpEdit4 = document.querySelector(".inp-edit4");
let savetoEdit = document.querySelector(".save-btn");
let editModal = document.querySelector("#exampleModal");
let btnEdit = document.querySelector(".btn-edit");

async function btnSaveEdit(id) {
  await fetch(`${API}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      inpEdit.value = data.name;
      inpEdit1.value = data.surname;
      inpEdit2.value = data.phone;
      inpEdit3.value = data.weekly;
      inpEdit4.value = data.monthly;

      savetoEdit.setAttribute("id", data.id);
      // ? 2 вариант
      //editSaveBtn.id = data.id
    });
}

savetoEdit.addEventListener("click", function () {
  let id = this.id;

  let name = inpEdit.value;
  let surname = inpEdit1.value;
  let phone = inpEdit2.value;
  let weekly = inpEdit3.value;
  let monthly = inpEdit4.value;

  if (!name || !surname || !phone || !weekly || !monthly) {
    alert("заполните поля");
    return;
  }

  // формируем объект на основе данных из инпута
  let editedProduct = {
    name: name,
    surname: surname,
    phone: phone,
    weekly: weekly,
    monthly: monthly,
  };

  console.log(editedProduct);
  // вызываем функцию для сохранения данных на сервере
  saveEdit(editedProduct, id);
});

function saveEdit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => render());

  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}

//!pagination
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let currentPage = 1;
let pageTotalCount = 1;

// ? search
let searchInp = document.querySelector("#search");
let searchVal = "";

function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 3);
      console.log(pageTotalCount);
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `
          <li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;

          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `
          <li class="page-item"><a class="page-link  page_number" href="#">${i}</a></li>`;

          paginationList.append(page1);
        }
      }

      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }
      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  // если  не находимся на первой странице, то перезаписываем currentPage и вызываем render
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  // отлавливаем клик по цифре из пагинации
  if (e.target.classList.contains("page_number")) {
    // перезаписываем currentPage на то значение ,которое содержит элемент ,на который нажали
    console.log(e.target);
    currentPage = e.target.innerText;
    // вызываем render с перезаписанным currentPage
    render();
  }
});

// search
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});
