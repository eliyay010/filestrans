const dropArea = document.querySelector(".dragDropArea");
let fileInput = document.querySelector("#fileInput");
let fileName = document.querySelector(".fileName");

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  updateChoice();
});

let updateChoice = function () {
  fileName.innerHTML = fileInput.files[0].name;
};
