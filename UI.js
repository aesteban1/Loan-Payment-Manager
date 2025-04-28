let loanContainer = document.querySelector('.loan-container')
let addEntryButton = document.getElementById('add-entry')
let updateLoansBtn = document.getElementById('update-loans')


const loanData = JSON.parse(localStorage.getItem("LPMdata")) || [];
let currentData = {}

//Displays the user input as regular text
function addToList(El, dataObj){
  El.outerHTML = `
  <li class="loan" id="group-${dataObj.id}">
    <p>${dataObj.loanName}</p>
    <p>$${Number.parseFloat(dataObj.balance).toFixed(2)}</p>
    <p>${Number.parseFloat(dataObj.rate).toFixed(2)}%</p>
    <p>$${Number.parseFloat(dataObj.minPayment).toFixed(2)}</p>
    <div class="expandDown">
          <button id="expand-${dataObj.id}" class="arrow" onclick=expandDown(this)></button>
    </div>
  </li>`
}

//Renders loan container as a list view from user data
function updateList(){
  loanContainer.innerHTML =`
      <div id="header">
      <div>Loan Name</div>
      <div>Balance</div>
      <div>Interest Rate</div>
      <div>Minimum Payment</div>
    </div>
    <ul id="loan-List"></ul>`

  let loanList = document.getElementById('loan-List')
  loanData.forEach(
    ({id, loanName, balance, rate, minPayment}) =>{
      loanList.innerHTML += `
      <li class="loan" id = 'group-${id}'>
        <p>${loanName}</p>
        <p>$${Number.parseFloat(balance).toFixed(2)}</p>
        <p>${Number.parseFloat(rate).toFixed(2)}%</p>
        <p>$${Number.parseFloat(minPayment).toFixed(2)}</p>
        <div class="expandDown">
          <button id="expand-${id}" class="arrow" onclick=expandDown(this)></button>
        </div>
      </li>`
    }
  )
  loanContainer.insertAdjacentHTML("beforeend", '<button id="add-entry" onclick="newListEntry()"><span class="note">Add New Entry</span>+</button>')
}

//Creates new input fields for a new list item
function newListEntry(){
  let loanList = document.getElementById('loan-List')
  let identifier = Date.now()
  let El = document.getElementById('add-entry')
  El.style.cursor = "not-allowed"
  El.disabled = true

  const HTMLString = `
  <div class="loan expand" id="group-${identifier}">
    <div><input type="text" placeholder="Name" id="name-group-${identifier}" class="loan-input"></input></div>
    <div><input type="number" min="1" placeholder="Balance ($)" id="balance-group-${identifier}" class="loan-input"></input></div>
    <div><input type="number" min="0" step="0.1" placeholder="0.00%" id="rate-group-${identifier}" class="loan-input"></input></div>
    <div><input type="number" min="0" step="0.01" placeholder="$0.00" id="minPayment-group-${identifier}" class="loan-input"></div>
    <div id="util">
    <button class="cancel-btn" onclick="cancelEntry(this)">Cancel</button>
    <button class="confirm-btn" id="${identifier}" onclick="confirmLoan(this)">Confirm</button>
    </div>
  </div>`

  loanList.insertAdjacentHTML('beforeend', HTMLString)
}

function editListEntry(identifier){
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === identifier);

  const {id, loanName, balance, rate, minPayment}=loanData[dataArrIndex]

  const HTMLString = `
    <div><input type="text" placeholder="Name" id="name-group-${id}" class="loan-input" value='${loanName}'></input></div>
    <div><input type="number" min="1" placeholder="Balance ($)" id="balance-group-${id}" class="loan-input" value='${balance}'></input></div>
    <div><input type="number" min="0" step="0.1" placeholder="0.00%" id="rate-group-${id}" class="loan-input" value='${rate}'></input></div>
    <div><input type="number" min="0" step="0.01" placeholder="$0.00" id="minPayment-group-${id}" class="loan-input" value='${minPayment}'></div>
    <div id="util">
      <button class="cancel-btn" onclick="deleteEntry(this)">Delete</button>
      <button class="confirm-btn" id="${id}" onclick="confirmLoan(this)">Confirm</button>
    </div>`

  addEntryButton.style.cursor = "not-allowed"
  addEntryButton.disabled = true;
  let container = document.getElementById(`group-${identifier}`)
  container.innerHTML = HTMLString

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
      <input type="checkbox" id ="toggle-${dataObj.id.split("-")[1]}" onclick="toggleModal(this)">
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
          <input type="checkbox" id ="toggle-${id.split("-")[1]}" onclick="toggleModal(this)">
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
    <label for="minPayment"><strong>Min Monthly Payment: </strong></label>
    <input type="number" min="0" step="0.01" placeholder="$0.00" id="minPayment-group-${number}" class="loan-input">
    <button class="confirm-btn" id="${number}" onclick="confirmLoan(this)">CONFIRM</button>
  </div>`

  addEntryButton.insertAdjacentHTML('beforebegin', HTMLString)
  addEntryButton.style.cursor = "not-allowed"
  addEntryButton.disabled = true;
}

//populates user input into an input form, ready for resubmition
function editGridEntry(buttonEl){
  let containerID = buttonEl.closest('.loan').id;
  let target = containerID.split('-')[1]
  console.log(target)
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === target);

  const {id, loanName, balance, rate, minPayment}=loanData[dataArrIndex]

  const HTMLString = 
  `<div class="loan" id="group-${id}">
    <label for="name-group-${id}"><strong>Loan Name</strong></label>
    <input type="text" placeholder="Name" id="name-group-${id}" class="loan-input" value="${loanName}"></input>
    <label for="balance-group-${id}"><strong>Balance</strong></label>
    <input type="number" min="1" placeholder="Balance" id="balance-group-${id}" class="loan-input" value="${balance}"></input>
    <label for="rate-group-${id}"><strong>Interest Rate</strong></label>
    <input type="number" min="0" step="0.1" placeholder="%" id="rate-group-${id}" class="loan-input" value="${rate}"></input>
    <label for="minPayment"><strong>Min Monthly Payment: </strong></label>
    <input type="number" min="0" step="0.01" placeholder="$0.00" id="minPayment-group-${id}" class="loan-input" value="${minPayment}">
    <button class="confirm-btn" id="${id}" onclick="confirmLoan(this)">CONFIRM</button>
  </div>`

  addEntryButton.style.cursor = "not-allowed"
  addEntryButton.disabled = true;
  document.getElementById(containerID).outerHTML =  HTMLString
}


//Confirmation, populates data to local storage for future use
function confirmLoan(buttonEl){
  const loanContainer = document.getElementsByClassName('loan-container')[0]
  const target = `${buttonEl.id}`//just a number
  const loanName = document.getElementById(`name-group-${target}`).value;
  const balance = document.getElementById(`balance-group-${target}`).value;
  const min_Payment = document.getElementById(`minPayment-group-${target}`).value;
  const rate = document.getElementById(`rate-group-${target}`).value;

  const dataArrIndex = loanData.findIndex((item)=>item.id === target)

  let El = document.getElementById('add-entry')
  El.disabled = false;
  El.style.cursor= "pointer"

  //create the data object
  const dataObj = {
    id:target,
    loanName: loanName ? loanName : target,
    balance:balance || 0,
    rate:rate || 0,
    minPayment: min_Payment || 0,
    daysElapsed: null
  }

  //save the data object
  if(dataArrIndex === -1){
    loanData.push(dataObj)
  }else{
    loanData[dataArrIndex] = dataObj
  }

  localStorage.setItem("LPMdata", JSON.stringify(loanData))

  let container = document.getElementById(`group-${target}`)

  if(loanContainer.classList.contains('list')){
    addToList(container, dataObj)

  }else{
    addToGrid(container, dataObj)
  }
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
  container = buttonEl.closest('.loan')
  let addEntry = document.getElementById('add-entry')
  addEntry.disabled = false;
  addEntry.style.cursor = "pointer"
  container.remove();
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
  const gridView = toggleView[1]
  loanContainer.classList.replace('grid', 'list')
  listView.classList.toggle('active-view')
  gridView.classList.toggle('active-view')
  updateList()
}

function gridView(){
  const toggleView = document.getElementById('view-toggle').children
  const listView = toggleView[0]
  const gridView = toggleView[1]
  loanContainer.classList.replace('list', 'grid')
  gridView.classList.toggle('active-view')
  listView.classList.toggle('active-view')
  updateGrid()
}

//Toggle the dropdown
function dropDown(buttonEl){
  // let content = buttonEl.nextElementSibling
  buttonEl.classList.toggle("active")
}

function expandDown(buttonEl){
  let El = buttonEl.id.split('-')[1];
  let content = buttonEl.closest('.loan')
  buttonEl.classList.toggle('active')
  content.classList.toggle('expand')
  editListEntry(El)
}

//Toggle the separate date calendar input field
function toggleModal(inputEl){
  let target = inputEl.id.split("-")[1]
  let element = `modal-${target}`
  let targetEl = document.getElementById(element)
  targetEl.classList.toggle('toggleModal')  
}

//reload all local storage data into the display field
window.addEventListener('DOMContentLoaded', (e)=>{
  updateLoanContainer()
})