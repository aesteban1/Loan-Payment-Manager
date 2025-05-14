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

//Creates new input fields for a new list item
function newListEntry(){
  let identifier = Date.now()
  openNewModal(identifier);
}

//All HTML onclick should be turned to JS eventListeners. Little at a time.
function openEditModal(dataObj){
  let UpdatedDataObj
  
  let editHandler = (e)=>{
    e.preventDefault()
    const formData = new FormData(modal)

    UpdatedDataObj ={
      id:dataObj.id,
      loanName: formData.get('loanName') || dataObj.id,
      balance:formData.get('loanBalance') || 0,
      rate:formData.get('loanRate') || 0,
      minPayment: formData.get('loanMin') || 0,
      order:formData.get('payment order'),
      daysElapsed: null
    }

    updateLocalStorage(UpdatedDataObj)

    updateListItem(document.getElementById(`group-${dataObj.id}`), UpdatedDataObj)
    modal.removeEventListener('submit', editHandler)
  }

  let cancelEdit = ()=>{
    modal.innerHTML=''
    modal.style.visibility='hidden'
    backdrop.style.visibility='hidden'

    modal.removeEventListener('submit', editHandler)
  }

  let deleteHandler = ()=>{
    deleteEntry(dataObj.id)
  }

  modal.innerHTML = `
      <input id="loanName" type="text" placeholder="Name" class="loan-input" value='${dataObj.loanName}' name='loanName'></input>
      <input id="loanBalance" type="number" min="1" placeholder="Balance ($)" class="loan-input" value='${dataObj.balance}' name='loanBalance'></input>
      <input id="loanRate" type="number" min="0" step="0.1" placeholder="0.00%" class="loan-input" value='${dataObj.rate}' name='loanRate'></input>
      <input id="loanMin" type="number" min="0" step="0.01" placeholder="$0.00" class="loan-input" value='${dataObj.minPayment}' name='loanMin'></input>
      <label for="payment order">Payment Order:</label>
      <select id="loanOrder" name="payment order">
        <option value="interest-first payments">Interest-First Payments</option>
        <option value="principal-first payments">Principal-First Payments</option>
      </select>
      <div id="util">
        <button id="editModalDelete-${dataObj.id}" type="button">Delete</button>
        <button id="editModalCancel-${dataObj.id}" class="cancel-btn">Cancel</button>
        <button form="blank-modal" type="submit" id="editModalConfirm" class="confirm-btn">Update</button>
      </div>`

      const cancelButton = document.getElementById(`editModalCancel-${dataObj.id}`)
      const deleteButton = document.getElementById(`editModalDelete-${dataObj.id}`)
      modal.style.visibility='visible'
      backdrop.style.visibility='visible'

      deleteButton.addEventListener('click', deleteHandler)
      cancelButton.addEventListener('click', cancelEdit)
      modal.addEventListener('submit', editHandler)
}

function openNewModal(identifier){
  let newObjData

  let handler = (e)=>{
    e.preventDefault()
    const formData = new FormData(modal)

    //Need to pass 'identifier' to the handler, so the event listener should be a paramenter function.
    //Use a function with a reference to call the handler function with parameters
    newObjData = {
      id:identifier,
      loanName: formData.get('loanName') || identifier,
      balance:formData.get('loanBalance') || 0,
      rate:formData.get('loanRate') || 0,
      minPayment: formData.get('loanMin') || 0,
      order:formData.get('payment order'),
      daysElapsed: null
    }
  
    updateLocalStorage(newObjData)
    addToList(document.getElementById('loan-List'), newObjData)
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
        <option selected value="interest-first payments">Interest-First Payments</option>
        <option value="principal-first payments">Principal-First Payments</option>
      </select>
      <div id="util">
        <button id="newModalCancel-${identifier}" class="cancel-btn">Cancel</button>
        <button form="blank-modal" type="submit" id="newModalConfirm" class="confirm-btn">Confirm</button>
      </div>`;
  modal.style.visibility= 'visible';
  backdrop.style.visibility='visible';

  const cancelButton = document.getElementById(`newModalCancel-${identifier}`)
  cancelButton.addEventListener('click', cancelEntry)
  modal.addEventListener('submit', handler)
}

//Displays the user input as regular text
function addToList(loanListContainer, dataObj){
  updateLocalStorage(dataObj)

  let openHandler = ()=>{
    openEditModal(dataObj)
  }
  let deleteHandler = ()=>{
    deleteEntry(dataObj.id)
  }
  let dropDownHandler = ()=>{
    dropDown(dataObj.id)
  }

  let HTMLString = `
  <tr class="loan" id="group-${dataObj.id}">
    <td>${dataObj.loanName}</td>
    <td>$${Number.parseFloat(dataObj.balance).toFixed(2)}</td>
    <td>${Number.parseFloat(dataObj.rate).toFixed(2)}%</td>
    <td>$${Number.parseFloat(dataObj.minPayment).toFixed(2)}</td>
    <td>${dataObj.order}</td>
    <td>
      <div class="dropdown">
        <button class="arrow" id='dropDownMenu-${dataObj.id}'></button>
        <ul class="dropdown-content">
          <li><button id="edit-${dataObj.id}" class="edit-btn menu-item">Edit</button></li>
          <li><button id="delete-${dataObj.id}" class="delete-btn menu-item">Delete</button></li>
        </ul>
      </div>
    </td>
  </tr>`

  loanListContainer.insertAdjacentHTML('beforeend', HTMLString)

  document.getElementById(`edit-${dataObj.id}`).addEventListener('click', openHandler)
  document.getElementById(`delete-${dataObj.id}`).addEventListener('click',deleteHandler)
  document.getElementById(`dropDownMenu-${dataObj.id}`).addEventListener('click', dropDownHandler)

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
    (dataObj) =>{
      let {id, loanName, balance, rate, minPayment, order} = dataObj

      loanList.innerHTML += `
      <tr class="loan" id = 'group-${id}'>
        <td>${loanName}</td>
        <td>$${Number.parseFloat(balance).toFixed(2)}</td>
        <td>${Number.parseFloat(rate).toFixed(2)}%</td>
        <td>$${Number.parseFloat(minPayment).toFixed(2)}</td>
        <td>${order}</td>
        <td>
          <div class="dropdown">
            <button class="arrow" id='dropDownMenu-${id}'></button>
            <ul class="dropdown-content">
              <li><button id="edit-${id}" class="edit-btn menu-item">Edit</button></li>
              <li><button id="delete-${id}" class="delete-btn menu-item">Delete</button></li>
            </ul>
          </div>
        </td>
      </tr>`

    })

    loanData.forEach(
      (dataObj)=>{

        let editHandler = ()=>{
          openEditModal(dataObj)
        }

        let deleteHandler = ()=>{
          deleteEntry(dataObj.id)
        }

        let dropDownHandler = ()=>{
          dropDown(dataObj.id)
        }

        document.getElementById(`edit-${dataObj.id}`).addEventListener('click',editHandler)
        document.getElementById(`delete-${dataObj.id}`).addEventListener('click',deleteHandler)
        document.getElementById(`dropDownMenu-${dataObj.id}`).addEventListener('click', dropDownHandler)
      }
    )
  loanContainer.insertAdjacentHTML("beforeend", '<button id="add-entry" onclick="newListEntry()"><span class="note">Add New Entry</span>+</button>')
}

//displays editable data within in an open modal
function updateListItem(loanEl, dataObj){
  openHandler =()=>{
    openEditModal(dataObj)
  }

  let deleteHandler = ()=>{
    deleteEntry(dataObj.id)
  }

  let dropDownHandler = ()=>{
    dropDown(dataObj.id)
  }

  loanEl.innerHTML = `
    <td>${dataObj.loanName}</td>
    <td>$${Number.parseFloat(dataObj.balance).toFixed(2)}</td>
    <td>${Number.parseFloat(dataObj.rate).toFixed(2)}%</td>
    <td>$${Number.parseFloat(dataObj.minPayment).toFixed(2)}</td>
    <td>${dataObj.order}</td>
    <td>
      <div class="dropdown">
        <button class="arrow" id='dropDownMenu-${dataObj.id}'></button>
        <ul class="dropdown-content">
          <li><button class="edit-btn menu-item" id='edit-${dataObj.id}'>Edit</button></li>
          <li><button class="delete-btn menu-item" id='delete-${dataObj.id}'>Delete</button></li>
        </ul>
      </div>
    </td>`

    document.getElementById(`edit-${dataObj.id}`).addEventListener('click', openHandler)
    document.getElementById(`delete-${dataObj.id}`).addEventListener('click',deleteHandler)
    document.getElementById(`dropDownMenu-${dataObj.id}`).addEventListener('click', dropDownHandler)

    backdrop.style.visibility="hidden"
    modal.style.visibility="hidden"
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
function updateLocalStorage(dataObj){
  const dataArrIndex = loanData.findIndex((item)=>item.id === dataObj.id)

  //save the data object
  if(dataArrIndex === -1){
    loanData.push(dataObj)
  }else{
    loanData[dataArrIndex] = dataObj
  }

  //Update Local storage with updated data array
  localStorage.setItem("LPMdata", JSON.stringify(loanData))
}

//Display user input as inline text
function updateLoanContainer(){
  loanContainer.innerHTML="";
  if(loanContainer.classList.contains('list')){
    updateList()
  }else{
    updateGrid()
  }

  document.addEventListener('click',(e)=>{
    if(!e.target.closest('.dropdown')){
      document.querySelectorAll('.arrow').forEach((el)=>{
        el.classList.remove('active')
      })
    }
  })
}

//cancel entry, deletes added container
function cancelEntry(){
  modal.innerHTML=''
  modal.style.visibility = 'hidden'
  backdrop.style.visibility = 'hidden'
}

//deletes current container
function deleteEntry(id){
  let container = document.getElementById(`group-${id}`).parentElement
  let dataArrIndex = loanData.findIndex((item)=>
    item.id === id
  );
  container.remove();
  loanData.splice(dataArrIndex, 1);
  localStorage.setItem("LPMdata", JSON.stringify(loanData))
  modal.style.visibility='hidden'
  backdrop.style.visibility='hidden'
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
function dropDown(id){
  let isOpen = document.getElementById(`dropDownMenu-${id}`).classList.contains('active')

  document.querySelectorAll('.arrow').forEach((el)=>{
    el.classList.remove('active')
  })

  if(!isOpen){
    document.getElementById(`dropDownMenu-${id}`).classList.add('active')
  }else{
    document.getElementById(`dropDownMenu-${id}`).classList.remove('active')
  }
}

//Toggle the separate date calendar input field
function toggleSwitch(inputEl){
  let identifier = inputEl.id.split("-")[1]
  let element = `modal-${identifier}`
  let targetEl = document.getElementById(element)
  targetEl.classList.toggle('toggleSwitch')  
}

//reload all local storage data to the display field
window.addEventListener('DOMContentLoaded', (e)=>{
  updateLoanContainer()
})