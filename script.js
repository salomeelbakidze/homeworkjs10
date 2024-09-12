"use strict";


let btnLoadMore = document.getElementById("btn-load-more");
let btnPrev = document.getElementById("btn-prev-users");
let ulElement = document.getElementById("ul-users");
let currentPage = 1;
let totalPages;


function getUsers(page) {
  fetch("https://reqres.in/api/users?page=" + page, {
    method: "GET",
  })
    .then(function (response) {
      // console.log(response);
      if (!response.ok) {
        throw "Server Error";
      }
      return response.json();
    })
    .then(function (dataInfo) {
      console.log(dataInfo);
      const fragment = document.createDocumentFragment();

      dataInfo.data.forEach((element) => {
        let li = document.createElement("li");

        let title = document.createElement("h2");
        title.innerText = `${element.first_name} ${element.last_name}`;

        let imgElement = document.createElement("img");
        imgElement.src = element.avatar;

        li.appendChild(title);
        li.appendChild(imgElement);
        fragment.appendChild(li);
      });

      ulElement.innerHTML = " ";
      ulElement.appendChild(fragment);

      totalPages = dataInfo.total_pages;
      disabledBtns();
    })
    .catch(function (error) {
      console.log(error);
    });
}
getUsers(currentPage);


function disabledBtns() {
  if (currentPage === 1) {
    btnPrev.disabled = true;
  } else {
    btnPrev.disabled = false;
  }

  if (currentPage === totalPages) {
    btnLoadMore.disabled = true;
  } else {
    btnLoadMore.disabled = false;
  }
}


btnLoadMore.addEventListener("click", function () {
  if (currentPage === totalPages) {
    return;
  }
  currentPage++;
  getUsers(currentPage);
});


btnPrev.addEventListener("click", function () {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  getUsers(currentPage);
});


let mainWraperPost = document.getElementById("posts-wraper");
let overlayPost = document.getElementById("overlay");
let content = document.getElementById("contentPost");
let closeIcon = document.getElementById("close");
let addPost = document.getElementById("add");
let overlayAdd = document.getElementById("overlay-add");
let form = document.getElementById("form-post");


function ajaxPosts(url, fnc) {
  let requist = new XMLHttpRequest();
  requist.open("GET", url);
  requist.addEventListener("load", function () {
   

    let responseData = JSON.parse(this.responseText); 
    fnc(responseData);
  });
  requist.send();
}

ajaxPosts("https://jsonplaceholder.typicode.com/posts", function (data) {
  
  data.forEach((element) => {
    createPostDiv(element);
  });
});

function createPostDiv(item) {
  let divElement = document.createElement("div");
  divElement.classList.add("post-container");
  divElement.setAttribute("data-id", item.id);

  let titleElement1 = document.createElement("h3");
  titleElement1.innerText = item.id;

  let titleElement2 = document.createElement("h2");
  titleElement2.innerText = item.title;

  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete This Post";
  deleteBtn.setAttribute("data-delete-id", item.id);

  divElement.appendChild(titleElement1);
  divElement.appendChild(titleElement2);
  divElement.appendChild(deleteBtn);

  
  deleteBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    console.log(this);
    let deleteBtnId = this.getAttribute("data-delete-id");
    console.log(deleteBtnId);
    let newDeleteUrl = `https://jsonplaceholder.typicode.com/posts/${deleteBtnId}`;
    console.log(newDeleteUrl);
    fetch(newDeleteUrl, {
      method: "DELETE",
    }).then(() => divElement.remove());
  });

  
  divElement.addEventListener("click", function () {
    overlayPost.classList.add("overlayActive");
    console.log(this);

    let clickedDivId = this.getAttribute("data-id");
    console.log(clickedDivId); 
    let newLink = `https://jsonplaceholder.typicode.com/posts/${clickedDivId}`;
    console.log(newLink);
    ajaxPosts(newLink, function (newData) {
      console.log(newData);
      let pDescr = document.createElement("p");
      pDescr.innerText = newData.body;
      content.appendChild(pDescr);
    });
  });

  mainWraperPost.appendChild(divElement);
}


closeIcon.addEventListener("click", function () {
  overlayPost.classList.remove("overlayActive");
  content.innerHTML = " ";
});


addPost.addEventListener("click", function () {
  overlayAdd.classList.add("activeOverlayAdd");
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(this[0].value); 
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title: this[0].value,
      userId: 11,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((newSendedObj) => {
      overlayAdd.classList.remove("activeOverlayAdd");
      this[0].value = " ";
      createPostDiv(newSendedObj);
      console.log(newSendedObj);
    });
});
