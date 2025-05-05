const loanContainer = document.querySelector('.loan-container')
const updateLoansBtn = document.getElementById('update-loans')
const backdrop = document.getElementById('overlay')
const modal = document.getElementById('blank-modal')
const loanNameInput = document.getElementById('loanName')
const loanBalanceInput = document.getElementById('loanBalance')
const loanRateInput = document.getElementById('loanRate')
const loanMinInput = document.getElementById('loanMin')
const loanOrderSelect = document.getElementById('loanOrder')
let currentLoanContainer
let currentLoanData


const loanData = JSON.parse(localStorage.getItem("LPMdata")) || [];
let currentData = {}

// MARK:Build the edit modal with approproate functions, and DOM updates
function openEditModal(buttonEl){
  let identifier = buttonEl.closest('.loan').id.split('-')[1]

  let editHandler = (e)=>{
    e.preventDefault
    const formData = new FormData(modal)
    let updatedDataObj ={

    }
  }

  modal.innerHTML = `
      <input id="loanName" type="text" placeholder="Name" class="loan-input"></input>
      <input id="loanBalance" type="number" min="1" placeholder="Balance ($)" class="loan-input"></input>
      <input id="loanRate" type="number" min="0" step="0.1" placeholder="0.00%" class="loan-input"></input>
      <input id="loanMin" type="number" min="0" step="0.01" placeholder="$0.00" class="loan-input">
      <label for="payment order">Payment Order:</label>
      <select id="loanOrder" name="payment order">
        <option value="interest-first payments">Interest-First Payments</option>
        <option value="principal-first payments">Principal-First Payments</option>
      </select>
      <div id="util">
        <button id="editModalCancel" class="cancel-btn">Cancel</button>
        <button form="blank-modal" type="submit" id="editModalConfirm" class="confirm-btn">Confirm</button>
      </div>`
      modal.style.visibility='visible'
      backdrop.style.visibility='visible'
}

function openNewModal(identifier){
  let handler = (e)=>{
    e.preventDefault()
    const formData = new FormData(modal)
    let newDataObj = {
      id:identifier,
      loanName: formData.get('loanName') || identifier,
      balance:formData.get('loanBalance') || 0,
      rate:formData.get('loanRate') || 0,
      minPayment: formData.get('loanMin') || 0,
      order:formData.get('payment order'),
      daysElapsed: null
    }
  
    addToList(document.getElementById('loan-List'), newDataObj)
    modal.removeEventListener('submit', handler)
  }

  let cancelEntry = ()=>{
    modal.innerHTML=''
    modal.style.visibility="hidden"
    backdrop.style.visibility="hidden"
  }

  modal.innerHTML = `
      <input id="loanName" type="text" placeholder="Name" class="loan-input" name="loanName"></input>
      <input id="loanBalance" type="number" min="1" placeholder="Balance ($)" class="loan-input" name="loanBalance"></input>
      <input id="loanRate" type="number" min="0" step="0.1" placeholder="0.00%" class="loan-input" name="loanRate"></input>
      <input id="loanMin" type="number" min="0" step="0.01" placeholder="$0.00" class="loan-input" name="loanMin">
      <label for="payment order">Payment Order:</label>
      <select id="loanOrder" name="payment order">
        <option value="interest-first payments">Interest-First Payments</option>
        <option value="principal-first payments">Principal-First Payments</option>
      </select>
      <div id="util">
        <button id="newModalCancel" class="cancel-btn">Cancel</button>
        <button form="blank-modal" type="submit" id="newModalConfirm" class="confirm-btn">Confirm</button>
      </div>`;
  modal.style.visibility= 'visible';
  backdrop.style.visibility='visible';

  const cancelButton = document.getElementById('newModalCancel')
  // const confirmButton = document.getElementById('newModalConfirm')

  cancelButton.addEventListener('click', cancelEntry)
  modal.addEventListener('submit', handler)
}

//Displays the user input as regular text
function addToList(loanListContainer, dataObj){
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === dataObj.id);

  if(dataArrIndex === -1){
    loanData.push(dataObj)
  }else{
    loanData[dataArrIndex] = dataObj
  }

  localStorage.setItem("LPMdata", JSON.stringify(loanData))

  let HTMLString = `
  <tr class="loan" id="group-${dataObj.id}">
    <td>${dataObj.loanName}</td>
    <td>$${Number.parseFloat(dataObj.balance).toFixed(2)}</td>
    <td>${Number.parseFloat(dataObj.rate).toFixed(2)}%</td>
    <td>$${Number.parseFloat(dataObj.minPayment).toFixed(2)}</td>
    <td>${dataObj.order}</td>
    <td>
      <div class="dropdown">
        <button class="arrow" onclick=dropDown(this)></button>
        <ul class="dropdown-content">
          <li><button class="edit-btn menu-item" onclick="openEditModal(this)">Edit</button></li>
          <li><button class="delete-btn menu-item" onclick="deleteEntry(this)">Delete</button></li>
        </ul>
      </div>
    </td>
  </tr>`

  loanListContainer.insertAdjacentHTML('beforeend', HTMLString)
  modal.innerHTML=''
  modal.style.visibility ='hidden'
  backdrop.style.visibility='hidden'
}

//Renders loan container as a list view from user data
function updateList(){
  loanContainer.innerHTML =`
    <table id="loan-List">
      <tr id="header">
        <th>Loan Name</th>
        <th>Balance</th>
        <th>Interest Rate</th>
        <th>Minimum Payment</th>
        <th>Payment Order</th>
      </tr>
    </table>`

  let loanList = document.getElementById('loan-List')
  loanData.forEach(
    ({id, loanName, balance, rate, minPayment, order}) =>{
      loanList.innerHTML += `
      <tr class="loan" id = 'group-${id}'>
        <td>${loanName}</td>
        <td>$${Number.parseFloat(balance).toFixed(2)}</td>
        <td>${Number.parseFloat(rate).toFixed(2)}%</td>
        <td>$${Number.parseFloat(minPayment).toFixed(2)}</td>
        <td>${order}</td>
        <td>
          <div class="dropdown">
            <button class="arrow" onclick=dropDown(this)></button>
            <ul class="dropdown-content">
              <li><button class="edit-btn menu-item" onclick="openEditModal(this)">Edit</button></li>
              <li><button class="delete-btn menu-item" onclick="deleteEntry(this)">Delete</button></li>
            </ul>
          </div>
        </td>
      </tr>`
    }
  )
  loanContainer.insertAdjacentHTML("beforeend", '<button id="add-entry" onclick="newListEntry()"><span class="note">Add New Entry</span>+</button>')
}

//Creates new input fields for a new list item
function newListEntry(){
  let identifier = Date.now()
  openNewModal(identifier);
}

//displays editable data within in an open modal
function editListEntry(buttonElement){
  currentLoanContainer = buttonElement.closest('.loan')
  let identifier = currentLoanContainer.id.split('-')[1]
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === identifier);
  currentLoanData = loanData[dataArrIndex]



  const {id, loanName, balance, rate, minPayment, order}=currentLoanData

  loanNameInput.value = loanName
  loanBalanceInput.value = balance
  loanRateInput.value = rate
  loanMinInput.value = minPayment
  loanOrderSelect.value = order
  openModal()

}

//Adds an item to the GRID
function addToGrid(container, dataObj){
  container.outerHTML = `
  <div class="loan" id="group-${dataObj.id}">
    <div class="dropdown">
      <button class="arrow" onclick=dropDown(this)></button>
      <ul class="dropdown-content">
        <li><button class="edit-btn menu-item" onclick="editGridEntry(this)">Edit</button></li>
        <li><button class="delete-btn menu-item" onclick="deleteEntry(this)">Delete</button></li>
      </ul>
    </div>
    <span><strong>Loan Name:</strong></span>
    <p>${dataObj.loanName}</p>
    <span><strong>Balance:</strong></span>
    <p>$${Number.parseFloat(dataObj.balance).toFixed(2)}</p>
    <span><strong>Interest Rate: </strong></span>
    <p>${Number.parseFloat(dataObj.rate).toFixed(2)}%</p>
    <span><strong>Minimum Payment: </strong></span>
    <p>$${Number.parseFloat(dataObj.minPayment).toFixed(2)}</p>
    <span class="enterDate">
      <span class ="tooltip">Toggle to set a unique payment date</span>
      <strong>Payment Date:</strong>
      </span>
    <label for="toggle-${dataObj.id.split("-")[1]}" class="toggle-container">
      <input type="checkbox" id ="toggle-${dataObj.id.split("-")[1]}" onclick="toggleSwitch(this)">
      <div class="slider"></div>
    </label>
    <form id="modal-${dataObj.id.split("-")[1]}" class="separateDate">
      <input type="date" required>
    </form>
  </div>`
}

//Updates the GRID with the most recent data
function updateGrid(){
  loanContainer.innerHTML=``
  loanData.forEach(
    ({id, loanName, balance, rate, minPayment}) => {
      loanContainer.innerHTML += `
      <div class="loan" id="group-${id}">
        <div class="dropdown">
          <button class="arrow" onclick=dropDown(this)></button>
          <ul class="dropdown-content">
            <li><button class="edit-btn menu-item" onclick="editGridEntry(this)">Edit</button></li>
            <li><button class="delete-btn menu-item" onclick="deleteEntry(this)">Delete</button></li>
          </ul>
        </div>
        <span><strong>Loan Name:</strong></span>
        <p>${loanName}</p>
        <span><strong>Balance:</strong></span>
        <p>$${Number.parseFloat(balance).toFixed(2)}</p>
        <span><strong>Interest Rate: </strong></span>
        <p>${Number.parseFloat(rate).toFixed(2)}%</p>
        <span><strong>Minimum Payment: </strong></span>
        <p>$${Number.parseFloat(minPayment).toFixed(2)}</p>
        <span class="enterDate">
          <span class ="tooltip">Toggle to set a unique payment date</span>
          <strong>Payment Date:</strong>
        </span>
        <label for="toggle-${id.split("-")[1]}" class="toggle-container">
          <input type="checkbox" id ="toggle-${id.split("-")[1]}" onclick="toggleSwitch(this)">
          <div class="slider"></div>
        </label>
        <form id="modal-${id.split("-")[1]}" class="separateDate">
          <input type="date" onchange="updateDateField(this)" required>
        </form>
      </div>`
    });
  loanContainer.innerHTML+=`<button id="add-entry" onclick="newGridEntry()" >+</button>`
}

//Adds GRID card with input fields
function newGridEntry(){
  const addEntryButton = document.getElementById('add-entry');
  let number = Date.now();

  // const HTMLString = 
  // `<div class="loan" id="group-${number}">
  //   <button class="cancel-btn" onclick="cancelEntry(this)">
  //     <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" height="22px"  width="22px" viewBox="1 1 22 22">
  //       <path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8.933-2.721-2.722c-.146-.146-.339-.219-.531-.219-.404 0-.75.324-.75.749 0 .193.073.384.219.531l2.722 2.722-2.728 2.728c-.147.147-.22.34-.22.531 0 .427.35.75.751.75.192 0 .384-.073.53-.219l2.728-2.728 2.729 2.728c.146.146.338.219.53.219.401 0 .75-.323.75-.75 0-.191-.073-.384-.22-.531l-2.727-2.728 2.717-2.717c.146-.147.219-.338.219-.531 0-.425-.346-.75-.75-.75-.192 0-.385.073-.531.22z" fill-rule="nonzero"/>
  //     </svg>
  //   </button>
  //   <label for="name-group-${number}"><strong>Loan Name</strong></label>
  //   <input type="text" placeholder="Name" id="name-group-${number}" class="loan-input"></input>
  //   <label for="balance-group-${number}"><strong>Balance</strong></label>
  //   <input type="number" min="1" placeholder="Balance" id="balance-group-${number}" class="loan-input"></input>
  //   <label for="rate-group-${number}"><strong>Interest Rate</strong></label>
  //   <input type="number" min="0" step="0.1" placeholder="%" id="rate-group-${number}" class="loan-input"></input>
  //   <label for="minPayment"><strong>Min Monthly Payment: </strong></label>
  //   <input type="number" min="0" step="0.01" placeholder="$0.00" id="minPayment-group-${number}" class="loan-input">
  //   <button class="confirm-btn" id="${number}" onclick="confirmLoan(this)">CONFIRM</button>
  // </div>`
  openModal(userInfoTemplate, identifier)

  addEntryButton.insertAdjacentHTML('beforebegin', HTMLString)
  addEntryButton.style.cursor = "not-allowed"
  addEntryButton.disabled = true;
}

//populates user input into an input form, ready for resubmition
function editGridEntry(buttonEl){
  const addEntryButton = document.getElementById('add-entry');
  let containerID = buttonEl.closest('.loan').id;
  let identifier = containerID.split('-')[1]
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === identifier);

  const {id, loanName, balance, rate, minPayment}=loanData[dataArrIndex]

  // const HTMLString = 
  // `<div class="loan" id="group-${id}">
  //   <label for="name-group-${id}"><strong>Loan Name</strong></label>
  //   <input type="text" placeholder="Name" id="name-group-${id}" class="loan-input" value="${loanName}"></input>
  //   <label for="balance-group-${id}"><strong>Balance</strong></label>
  //   <input type="number" min="1" placeholder="Balance" id="balance-group-${id}" class="loan-input" value="${balance}"></input>
  //   <label for="rate-group-${id}"><strong>Interest Rate</strong></label>
  //   <input type="number" min="0" step="0.1" placeholder="%" id="rate-group-${id}" class="loan-input" value="${rate}"></input>
  //   <label for="minPayment"><strong>Min Monthly Payment: </strong></label>
  //   <input type="number" min="0" step="0.01" placeholder="$0.00" id="minPayment-group-${id}" class="loan-input" value="${minPayment}">
  //   <button class="confirm-btn" id="${id}" onclick="confirmLoan(this)">CONFIRM</button>
  // </div>`

  addEntryButton.style.cursor = "not-allowed"
  addEntryButton.disabled = true;
  document.getElementById(containerID).outerHTML =  HTMLString
}


//Confirmation, populates data to local storage for future use
function confirmLoan(buttonEl){
  const loanContainer = document.getElementsByClassName('loan-container')[0]
  let identifier = currentLoanContainer.id.split('-')[1]
  const dataArrIndex = loanData.findIndex((item)=>item.id === identifier)

  // let El = document.getElementById('add-entry')
  // El.disabled = false;
  // El.style.cursor= "pointer"

  //create the data object
  const dataObj = {
    id:identifier,
    loanName: loanNameInput.value ? loanNameInput.value : identifier,
    balance:loanBalanceInput.value || 0,
    rate:loanRateInput.value || 0,
    minPayment: loanMinInput.value || 0,
    order:loanOrderSelect.value,
    daysElapsed: null
  }

  //save the data object
  if(dataArrIndex === -1){
    loanData.push(dataObj)
  }else{
    loanData[dataArrIndex] = dataObj
  }

  localStorage.setItem("LPMdata", JSON.stringify(loanData))

  let container = document.getElementById(`loan-List`)

  if(loanContainer.classList.contains('list')){
    addToList(container, dataObj)

  }else{
    addToGrid(container, dataObj)
  }
  modal.innerHTML=''
  modal.style.visibility='hidden'
  backdrop.style.visibility='hidden'
}

//Display user input as inline text
function updateLoanContainer(){
  loanContainer.innerHTML="";
  if(loanContainer.classList.contains('list')){
    updateList()
  }else{
    updateGrid()
  }
}

//cancel entry, deletes added container
function cancelEntry(buttonEl){
  const openModal = buttonEl.closest('.editable-modal')
  openModal.style.visibility = 'hidden'
  backdrop.style.visibility = 'hidden'
  openModal.innerHTML=''
}

//deletes current container
function deleteEntry(buttonEl){
  let container = buttonEl.closest('.loan')
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === container.id
  );

  container.remove();
  loanData.splice(dataArrIndex, 1);
  localStorage.setItem("LPMdata", JSON.stringify(loanData))
}

function listView(){
  const toggleView = document.getElementById('view-toggle').children
  const listView = toggleView[0]
  if(!listView.classList.contains('active-view')){
    const gridView = toggleView[1]
    loanContainer.classList.replace('grid', 'list')
    listView.classList.toggle('active-view')
    gridView.classList.toggle('active-view')
    updateList()
  }
}

function gridView(){
  const toggleView = document.getElementById('view-toggle').children
  const gridView = toggleView[1]
  if(!gridView.classList.contains('active-view')){
    const listView = toggleView[0]
    loanContainer.classList.replace('list', 'grid')
    gridView.classList.toggle('active-view')
    listView.classList.toggle('active-view')
    updateGrid()
  }
}

//Toggle the dropdown
function dropDown(buttonEl){
  // let content = buttonEl.nextElementSibling
  buttonEl.classList.toggle("active")
}

// function expandDown(buttonEl){
//   let El = buttonEl.id.split('-')[1];
//   let content = buttonEl.closest('.loan')
//   buttonEl.classList.toggle('active')
//   content.classList.toggle('expand')
//   editListEntry(El)
// }

//Toggle the separate date calendar input field
function toggleSwitch(inputEl){
  let identifier = inputEl.id.split("-")[1]
  let element = `modal-${identifier}`
  let targetEl = document.getElementById(element)
  targetEl.classList.toggle('toggleSwitch')  
}

//reload all local storage data into the display field
window.addEventListener('DOMContentLoaded', (e)=>{
  updateLoanContainer()
})