let loanContainer = document.querySelector('.loan-container')
let addEntryButton = document.getElementById('add-entry')
let updateLoansBtn = document.getElementById('update-loans')

const loanData = JSON.parse(localStorage.getItem("LPMdata")) || [];
let currentData = {}

function confirmLoan(buttonEl){
  const target = buttonEl.parentElement.id;
  const loanName = document.getElementById(`name-${target}`).value;
  const balance = document.getElementById(`balance-${target}`).value;
  const rate = document.getElementById(`rate-${target}`).value;
  const dataArrIndex = loanData.findIndex((item)=>item.id === target)

  let El = document.getElementById('add-entry')
  El.disabled = false;
  El.style.cursor= "pointer"


  const dataObj = {
    id:target,
    loanName: loanName || target.split('-')[1],
    balance:balance || 0,
    rate:rate || 0
  }

  if(dataArrIndex === -1){
    loanData.push(dataObj)
  }else{
    loanData[dataArrIndex] = dataObj
  }

  localStorage.setItem("LPMdata", JSON.stringify(loanData))

  let container = document.getElementById(target)
  container.outerHTML = `
      <div class="loan" id="${dataObj.id}">
        <div class="dropdown">
          <button class="arrow" onclick=dropDown(this)></button>
          <ul class="dropdown-content">
            <li><button class="edit-btn menu-item" onclick="editEntry(this)">Edit</button></li>
            <li><button class="delete-btn menu-item" onclick="deleteEntry(this)">Delete</button></li>
          </ul>
        </div>
        <span><strong>Loan Name:</strong></span>
        <p>${dataObj.loanName}</p>
        <span><strong>Balance:</strong></span>
        <p>$${dataObj.balance}</p>
        <span><strong>Interest Rate: </strong></span>
        <p>${dataObj.rate}%</p>
        <span class="enterDate"><strong>Separate Date:</strong></span>
        <label for="toggle-${dataObj.id.split("-")[1]}" class="toggle-container">
          <input type="checkbox" id ="toggle-${dataObj.id.split("-")[1]}" onclick="toggleModal(this)">
          <span class="slider"></span>
        </label>
        <form id="modal-${dataObj.id.split("-")[1]}" class="separateDate">
          <input type="date" required>
        </form>
      </div>`
}

function updateLoanContainer(){

  loanContainer.innerHTML="";

  loanData.forEach(
    ({id, loanName, balance, rate}) => {
      loanContainer.innerHTML += `
      <div class="loan" id="${id}">
        <div class="dropdown">
          <button class="arrow" onclick=dropDown(this)></button>
          <ul class="dropdown-content">
            <li><button class="edit-btn menu-item" onclick="editEntry(this)">Edit</button></li>
            <li><button class="delete-btn menu-item" onclick="deleteEntry(this)">Delete</button></li>
          </ul>
        </div>
        <span><strong>Loan Name:</strong></span>
        <p>${loanName}</p>
        <span><strong>Balance:</strong></span>
        <p>$${balance}</p>
        <span><strong>Interest Rate: </strong></span>
        <p>${rate}%</p>
        <span class="enterDate"><strong>Separate Date:</strong></span>
        <label for="toggle-${id.split("-")[1]}" class="toggle-container">
          <input type="checkbox" id ="toggle-${id.split("-")[1]}" onclick="toggleModal(this)">
          <span class="slider"></span>
        </label>
        <form id="modal-${id.split("-")[1]}" class="separateDate">
          <input type="date" required>
        </form>
      </div>`
    });
  loanContainer.innerHTML+=`<button id="add-entry" onclick="addEntry()" >+</button>`
}

function addEntry(){
  const addEntryButton = document.getElementById('add-entry');
  let number = Date.now();

  const HTMLString = 
  `<div class="loan" id="group-${number}">
    <button class="cancel-btn" onclick="cancelEntry(this)">
      <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" height="22px"  width="22px" viewBox="1 1 22 22">
        <path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8.933-2.721-2.722c-.146-.146-.339-.219-.531-.219-.404 0-.75.324-.75.749 0 .193.073.384.219.531l2.722 2.722-2.728 2.728c-.147.147-.22.34-.22.531 0 .427.35.75.751.75.192 0 .384-.073.53-.219l2.728-2.728 2.729 2.728c.146.146.338.219.53.219.401 0 .75-.323.75-.75 0-.191-.073-.384-.22-.531l-2.727-2.728 2.717-2.717c.146-.147.219-.338.219-.531 0-.425-.346-.75-.75-.75-.192 0-.385.073-.531.22z" fill-rule="nonzero"/>
      </svg>
    </button>
    <label for="name-group-${number}"><strong>Loan Name</strong></label>
    <input type="text" placeholder="Name" id="name-group-${number}" class="loan-input"></input>
    <label for="balance-group-${number}"><strong>Balance</strong></label>
    <input type="number" min="1" placeholder="Balance" id="balance-group-${number}" class="loan-input"></input>
    <label for="rate-group-${number}"><strong>Interest Rate</strong></label>
    <input type="number" min="0" step="0.1" placeholder="%" id="rate-group-${number}" class="loan-input"></input>
    <button class="confirm-btn" onclick="confirmLoan(this)">CONFIRM</button>
  </div>`

  addEntryButton.insertAdjacentHTML('beforebegin', HTMLString)
  addEntryButton.style.cursor = "not-allowed"
  addEntryButton.disabled = true;
}

function cancelEntry(buttonEl){
  let target = document.getElementById('add-entry')
  target.disabled = false;
  target.style.cursor = "pointer"
  buttonEl.parentElement.remove()
}

function deleteEntry(buttonEl){
  let container = buttonEl.closest('.loan')
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === container.id
  );

  container.remove();
  loanData.splice(dataArrIndex, 1);
  localStorage.setItem("LPMdata", JSON.stringify(loanData))
}

function editEntry(buttonEl){
  let target = buttonEl.closest('.loan');
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === target.id);

  const {id, loanName, balance, rate}=loanData[dataArrIndex]

  const HTMLString = 
  `<div class="loan" id="${id}">
    <label for="name-${id}"><strong>Loan Name</strong></label>
    <input type="text" placeholder="Name" id="name-${id}" class="loan-input" value="${loanName}"></input>
    <label for="balance-${id}"><strong>Balance</strong></label>
    <input type="number" min="1" placeholder="Balance" id="balance-${id}" class="loan-input" value="${balance}"></input>
    <label for="rate-${id}"><strong>Interest Rate</strong></label>
    <input type="number" min="0" step="0.1" placeholder="%" id="rate-${id}" class="loan-input" value="${rate}"></input>
    <button class="confirm-btn" onclick="confirmLoan(this)">CONFIRM</button>
  </div>`

  document.getElementById(target.id).outerHTML =  HTMLString
}

function dropDown(buttonEl){
  let content = buttonEl.nextElementSibling
  buttonEl.classList.toggle("active")
}

function toggleModal(inputEl){
  let target = inputEl.id.split("-")[1]
  let element = `modal-${target}`
  let targetEl = document.getElementById(element)
  console.log(targetEl.classList)
  targetEl.classList.toggle('toggleModal')
  console.log(targetEl.classList)
  
}

window.addEventListener('load', (e)=>{
  updateLoanContainer()
})