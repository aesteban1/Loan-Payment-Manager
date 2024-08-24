let loanContainer = document.querySelector('.loan-container')
let addEntryButton = document.getElementById('add-entry')
let updateLoansBtn = document.getElementById('update-loans')

const loanData = JSON.parse(localStorage.getItem("LPMdata")) || [];
let currentData = {}

function addOrUpdateLoan(buttonEl){
  const target = buttonEl.parentElement.id
  const dataArrIndex = loanData.findIndex((item)=>item.id === target)

  const dataObj = {
    id:target,
    loanName: document.getElementById(`name-${target}`).value || target.split('-')[1],
    balance:document.getElementById(`balance-${target}`).value || 0,
    rate:document.getElementById(`rate-${target}`).value || 0
  }

  console.log(dataObj)

  if(dataArrIndex === -1){
    loanData.push(dataObj)
  }else{
    loanData[dataArrIndex] = dataObj
  }

  localStorage.setItem("LPMdata", JSON.stringify(loanData))
  updateLoanContainer()
}

function updateLoanContainer(){

  loanContainer.innerHTML="";

  loanData.forEach(
    ({id, loanName, balance, rate}) => {
      loanContainer.innerHTML += `
      <div class="loan" id="${id}">
      <span><strong>Name:</strong></span>
      <p>${loanName}</p>
      <span><strong>Balance:</strong></span>
      <p>$${balance}</p>
      <span><strong>Interest Rate: </strong></span>
      <p>${rate}%</p>
      <button class="edit-btn group-btn" onclick="editEntry(this)">
          <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24"><path d="m4.481 15.659c-1.334 3.916-1.48 4.232-1.48 4.587 0 .528.46.749.749.749.352 0 .668-.137 4.574-1.492zm1.06-1.061 3.846 3.846 11.321-11.311c.195-.195.293-.45.293-.707 0-.255-.098-.51-.293-.706-.692-.691-1.742-1.74-2.435-2.432-.195-.195-.451-.293-.707-.293-.254 0-.51.098-.706.293z" fill-rule="nonzero"/></svg>
      </button>
      <button class="delete-btn group-btn" onclick="deleteEntry(this)">
          <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24"><path d="m20.015 6.506h-16v14.423c0 .591.448 1.071 1 1.071h14c.552 0 1-.48 1-1.071 0-3.905 0-14.423 0-14.423zm-5.75 2.494c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-4.5 0c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-.75-5v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-16.507c-.413 0-.747-.335-.747-.747s.334-.747.747-.747zm4.5 0v-.5h-3v.5z" fill-rule="nonzero"/></svg>
      </button>
      <div>`
    });
  loanContainer.innerHTML+=`<button id="add-entry" onclick="addEntry()" >+</button>`
}

function addEntry(){
  const addEntryButton = document.getElementById('add-entry');
  let number = Date.now();

  const HTMLString = 
  `<div class="loan" id="group-${number}">
  <label for="name-group-${number}">Loan Name</label>
  <input type="text" placeholder="Name" id="name-group-${number}" class="loan-input"></input>
  <label for="balance-group-${number}">Balance</label>
  <input type="number" min="1" placeholder="Balance" id="balance-group-${number}" class="loan-input"></input>
  <label for="rate-group-${number}">Interest Rate</label>
  <input type="number" min="0" step="0.1" placeholder="%" id="rate-group-${number}" class="loan-input"></input>
  <button class="confirm-btn" onclick="addOrUpdateLoan(this)">CONFIRM</button>
  </div>`

  addEntryButton.insertAdjacentHTML('beforebegin', HTMLString)
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
  <button class="confirm-btn" onclick="addOrUpdateLoan(this)" >CONFIRM</button>
  </div>`

  document.getElementById(target).outerHTML =  HTMLString
}