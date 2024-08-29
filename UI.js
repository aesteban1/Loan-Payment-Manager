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
  updateLoanContainer()
  addEntryButton.disabled = false;
}

function updateLoanContainer(){

  loanContainer.innerHTML="";

  loanData.forEach(
    ({id, loanName, balance, rate}) => {
      loanContainer.innerHTML += `
      <div class="loan" id="${id}">
        <div class="dropdown">
          <button onclick="toggleDropdown(this)">...</button>
          <ul class="dropdown-content hide">
            <li><button onclick="editEntry(this)">Edit</button></li>
            <li><button onclick="deleteEntry(this)">Delete</button></li>
          </ul>
        </div>
        <span><strong>Loan Name:</strong></span>
        <p>${loanName}</p>
        <span><strong>Balance:</strong></span>
        <p>$${balance}</p>
        <span><strong>Interest Rate: </strong></span>
        <p>${rate}%</p>
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
      <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" height="22px"  width="22px" viewBox="1 1 22 22"><path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8.933-2.721-2.722c-.146-.146-.339-.219-.531-.219-.404 0-.75.324-.75.749 0 .193.073.384.219.531l2.722 2.722-2.728 2.728c-.147.147-.22.34-.22.531 0 .427.35.75.751.75.192 0 .384-.073.53-.219l2.728-2.728 2.729 2.728c.146.146.338.219.53.219.401 0 .75-.323.75-.75 0-.191-.073-.384-.22-.531l-2.727-2.728 2.717-2.717c.146-.147.219-.338.219-.531 0-.425-.346-.75-.75-.75-.192 0-.385.073-.531.22z" fill-rule="nonzero"/></svg>
    </button>
    <label for="name-group-${number}">Loan Name</label>
    <input type="text" placeholder="Name" id="name-group-${number}" class="loan-input"></input>
    <label for="balance-group-${number}">Balance</label>
    <input type="number" min="1" placeholder="Balance" id="balance-group-${number}" class="loan-input"></input>
    <label for="rate-group-${number}">Interest Rate</label>
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
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === buttonEl.parentElement.id
  );

  buttonEl.parentElement.remove();
  loanData.splice(dataArrIndex, 1);
  localStorage.setItem("LPMdata", JSON.stringify(loanData))
}

function editEntry(buttonEl){
  let target = buttonEl.parentElement.id;
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === target
  )
  console.log(loanData)
  const {id, loanName, balance, rate}=loanData[dataArrIndex]

  const HTMLString = 
  `<div class="loan" id="${id}">
    <label for="name-${id}">Loan Name</label>
    <input type="text" placeholder="Name" id="name-${id}" class="loan-input" value="${loanName}"></input>
    <label for="balance-${id}">Balance</label>
    <input type="number" min="1" placeholder="Balance" id="balance-${id}" class="loan-input" value="${balance}"></input>
    <label for="rate-${id}">Interest Rate</label>
    <input type="number" min="0" step="0.1" placeholder="%" id="rate-${id}" class="loan-input" value="${rate}"></input>
    <button class="confirm-btn" onclick="confirmLoan(this)" >CONFIRM</button>
    <button class="delete-btn group-btn" onclick="deleteEntry(this)">
      <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24"><path d="m20.015 6.506h-16v14.423c0 .591.448 1.071 1 1.071h14c.552 0 1-.48 1-1.071 0-3.905 0-14.423 0-14.423zm-5.75 2.494c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-4.5 0c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-.75-5v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-16.507c-.413 0-.747-.335-.747-.747s.334-.747.747-.747zm4.5 0v-.5h-3v.5z" fill-rule="nonzero"/></svg>
    </button>
  </div>`

  document.getElementById(target).outerHTML =  HTMLString
}

function toggleDropdown(buttonEl){
  let content = buttonEl.nextElementSibling
  content.classList.toggle("show")
}

window.addEventListener('load', (e)=>{
  updateLoanContainer()
})