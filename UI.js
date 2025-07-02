const loanContainer = document.querySelector('.loan-container')
const updateLoansBtn = document.getElementById('update-loans')
const viewToggleContainer = document.getElementById('view-toggle')
const toolsContainer = document.getElementById('tools')
const backdrop = document.getElementById('overlay')
const modal = document.getElementById('blank-modal')
const utilities = document.getElementById('utilities')
let selectedItemsArray = null
let selectMode = false;
let countElement

const loanData = JSON.parse(localStorage.getItem("LPMdata")) || [];
let currentData = {}

function toolListeners(){
  let selectListener = ()=>{
    let viewMode = localStorage.getItem('viewMode')
    if(!multiselect.classList.contains('active-view')){
      viewMode === 'list' ? selectListRender() : selectGridRender()
      multiselect.classList.add('active-view')
    }else{
      exitMultiselect()
    }
  }
  
  let multiselect = document.getElementById('multi-select')
  multiselect.addEventListener('click', selectListener)
}

function viewListeners(){
  let listViewHandler = ()=>{listView()}
  let gridViewHandler = ()=>{gridView()}

  if(localStorage.getItem('viewMode') === 'list'){
    listView()
  }else{
    gridView()
  }

  Array.from(viewToggleContainer.children).forEach((child)=>{
    if(child.id === 'list-view'){
      child.addEventListener('click', listViewHandler)
    }else{
      child.addEventListener('click', gridViewHandler)}
  })
}
//Creates new id for a new list item
function newListEntry(){
  let identifier = Date.now()
  openNewModal(identifier);
}
//creates new id for  a new grid item
function newGridEntry(){
  let number = Date.now();
  openNewModal(number)
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
      loanType: formData.get('loan type') || 'personal loan'
    }

    updateLocalStorage(UpdatedDataObj)

    if(localStorage.getItem('viewMode') === 'list'){
      updateListItem(document.getElementById(`group-${dataObj.id}`), UpdatedDataObj)
    }else{
      updateGridItem(document.getElementById(`group-${dataObj.id}`), UpdatedDataObj)
    }

    modal.removeEventListener('submit', editHandler)
  }

  let cancelEdit = ()=>{
    modal.innerHTML=''
    modal.removeEventListener('submit', editHandler)
    modal.style.visibility='hidden'
    backdrop.style.visibility='hidden'

    modal.removeEventListener('submit', editHandler)
  }

  let deleteHandler = ()=>{
    deleteEntry(dataObj.id)
  }

  modal.innerHTML = `
      <span>Edit Existing Entry</span>
      <input data-cell=''loan name id="loanName" type="text" placeholder="Name" class="loan-input" value='${dataObj.loanName}' name='loanName'></input>
      <input data-cell='balance' id="loanBalance" type="number" min="1" placeholder="Balance ($)" class="loan-input" value='${dataObj.balance}' name='loanBalance'></input>
      <input data-cell='interest rate' id="loanRate" type="number" min="0" step="0.1" placeholder="0.00%" class="loan-input" value='${dataObj.rate}' name='loanRate'></input>
      <input data-cell='minimum payment' id="loanMin" type="number" min="0" step="0.01" placeholder="$0.00" class="loan-input" value='${dataObj.minPayment}' name='loanMin'></input>
      <div class='select-menu'>
        <label for="payment order">Payment Order:</label>
        <select id="loanOrder" name="payment order">
          <option value="interest-first payments">Interest-First Payments</option>
          <option value="principal-first payments">Principal-First Payments</option>
        </select>
      </div>
      <div class="select-menu">
        <label for="loan type">Loan Type: </label>
        <select id="loan-type" name="loan type">
          <option value="federal student loan">Federal Student Loan</option>
          <option value="private student loan">Private Student Loan</option>
          <option value="credit card debt">Credit Card</option>
          <option value="car loan">Car Loan</option>
          <option value="mortgage">Mortgage</option>
          <option value="personal Loan">Personal Loan</option>
          <option value="buy now pay later">Buy Now, Pay Later</option>
          <option value="home equity loan">Home Equity Loan</option>
          <option value="medical debt">Medical Debt</option>
          <option value="Payday/Title Loan">Payday/Title Loan</option>
        </select>
      </div>
      <div id="util">
        <button id="editModalDelete-${dataObj.id}"  class='delete-btn' type="button">Delete</button>
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
  let newDataObj

  let handler = (e)=>{
    e.preventDefault()
    const formData = new FormData(modal)

    //Need to pass 'identifier' to the handler, so the event listener should be a paramenter function.
    //Use a function with a reference to call the handler function with parameters
    newDataObj = {
      id:identifier,
      loanName: formData.get('loanName') || identifier,
      balance:formData.get('loanBalance') || 0,
      rate:formData.get('loanRate') || 0,
      minPayment: formData.get('loanMin') || 0,
      order:formData.get('payment order'),
      loanType: null
    }
  
    updateLocalStorage(newDataObj)

    if(localStorage.getItem('viewMode') === 'list'){
      addToList(document.getElementById('loan-List'), newDataObj)
    }else{
      addToGrid(loanContainer, newDataObj)
    }

    modal.removeEventListener('submit', handler)
  }

  let cancelEntry = ()=>{
    modal.innerHTML=''
    modal.removeEventListener('submit', handler)
    modal.style.visibility="hidden"
    backdrop.style.visibility="hidden"
  }

  modal.innerHTML = `
      <span>Create A New Entry</span>
      <input data-cell="loan name" id="loanName" type="text" placeholder="Name" class="loan-input" name="loanName"></input>
      <input data-cell="balance" id="loanBalance" type="number" min="1" placeholder="Balance ($)" class="loan-input" name="loanBalance"></input>
      <input data-cell="interest rate" id="loanRate" type="number" min="0" step="0.1" placeholder="0.00%" class="loan-input" name="loanRate"></input>
      <input data-cell="minimum payment" id="loanMin" type="number" min="0" step="0.01" placeholder="$0.00" class="loan-input" name="loanMin">
      <div class='select-menu'>
        <label for="payment order">Payment Order:</label>
        <select id="loanOrder" name="payment order">
          <option selected value="interest-first payments">Interest-First Payments</option>
          <option value="principal-first payments">Principal-First Payments</option>
        </select>
      </div>
      <div class="select-menu">
        <label for="loan type">Loan Type: </label>
        <select id="loan-type" name="loan type">
          <option value="federal student loan">Federal Student Loan</option>
          <option value="private student loan">Private Student Loan</option>
          <option value="credit card debt">Credit Card</option>
          <option value="car loan">Car Loan</option>
          <option value="mortgage">Mortgage</option>
          <option value="personal Loan">Personal Loan</option>
          <option value="buy now pay later">Buy Now, Pay Later</option>
          <option value="home equity loan">Home Equity Loan</option>
          <option value="medical debt">Medical Debt</option>
          <option value="Payday/Title Loan">Payday/Title Loan</option>
        </select>
      </div>
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

    modal.innerHTML=''
    backdrop.style.visibility="hidden"
    modal.style.visibility="hidden"
}

//Adds an item to the GRID
function addToGrid(container, dataObj){

  let openHandler = ()=>{
    openEditModal(dataObj)
  }
  let deleteHandler = ()=>{
    deleteEntry(dataObj.id)
  }
  let dropDownHandler = ()=>{
    dropDown(dataObj.id)
  }

  let HTMLString= `
  <div class="loan" id="group-${dataObj.id}">
    <div class="dropdown">
      <button id='dropDownMenu-${dataObj.id}' class="arrow"></button>
      <ul class="dropdown-content">
        <li><button id='edit-${dataObj.id}' class="edit-btn menu-item">Edit</button></li>
        <li><button id='delete-${dataObj.id}' class="delete-btn menu-item">Delete</button></li>
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
    <span><strong>Payment Order: </strong></span>
    <p>${dataObj.order}</p>
  </div>`

  document.getElementById('add-entry').insertAdjacentHTML('beforebegin', HTMLString)

  document.getElementById(`dropDownMenu-${dataObj.id}`).addEventListener('click', dropDownHandler)
  document.getElementById(`edit-${dataObj.id}`).addEventListener('click', openHandler)
  document.getElementById(`delete-${dataObj.id}`).addEventListener('click', deleteHandler)

  modal.innerHTML=''
  modal.style.visibility ='hidden'
  backdrop.style.visibility='hidden'
}

//Updates the GRID with the most recent data
function updateGrid(){
  loanContainer.innerHTML=``
  loanData.forEach(
    ({id, loanName, balance, rate, minPayment, order, loanType}) => {
      loanContainer.innerHTML += `
      <div class="loan" id="group-${id}">
        <div class="dropdown">
          <button id='dropDownMenu-${id}' class="arrow"></button>
          <ul class="dropdown-content">
            <li><button id='edit-${id}' class="edit-btn menu-item">Edit</button></li>
            <li><button id='delete-${id}' class="delete-btn menu-item">Delete</button></li>
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
        <span><strong>Payment Order</strong></span>
        <p>${order}</p>
      </div>`
    });

  loanContainer.insertAdjacentHTML('beforeend',`<button id="add-entry" onclick="newGridEntry()">+</button>`)

  loanData.forEach(
  (dataObj)=>{
    let openHandler = ()=>{
      openEditModal(dataObj)
    }

    let deleteHandler = ()=>{
      deleteEntry(dataObj.id)
    }

    let dropDownHandler = ()=>{
      dropDown(dataObj.id)
    }
    document.getElementById(`edit-${dataObj.id}`).addEventListener('click',openHandler)
    document.getElementById(`delete-${dataObj.id}`).addEventListener('click',deleteHandler)
    document.getElementById(`dropDownMenu-${dataObj.id}`).addEventListener('click', dropDownHandler)
  })
}

function updateGridItem(loanEl, dataObj){
  let openHandler = ()=>{
    openEditModal(dataObj)
  }
  let deleteHandler = ()=>{
    deleteEntry(dataObj.id)
  }
  let dropDownHandler = ()=>{
    dropDown(dataObj.id)
  }


  loanEl.innerHTML =`
    <div class="dropdown">
      <button id='dropDownMenu-${dataObj.id}' class="arrow"></button>
      <ul class="dropdown-content">
        <li><button id='edit-${dataObj.id}' class="edit-btn menu-item">Edit</button></li>
        <li><button id='delete-${dataObj.id}' class="delete-btn menu-item">Delete</button></li>
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
    <span><strong>Payment Order</strong><span>
    <p>${dataObj.order}</p>`

  document.getElementById(`dropDownMenu-${dataObj.id}`).addEventListener('click', dropDownHandler)
  document.getElementById(`edit-${dataObj.id}`).addEventListener('click', openHandler)
  document.getElementById(`delete-${dataObj.id}`).addEventListener('click', deleteHandler)

  modal.innerHTML=''
  modal.style.visibility ='hidden'
  backdrop.style.visibility='hidden'
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
  modal.removeEventListener('submit', handler)
  modal.innerHTML=''
  modal.style.visibility = 'hidden'
  backdrop.style.visibility = 'hidden'
}

//deletes current container
function deleteEntry(id){
  let HTMLString = `
  <dialog id='confirm-modal'>Delete Entry?
    <div>
      <button id='no-btn'>Cancel</button>
      <button id='yes-btn'>Delete</button>
    </div>
  </dialog>`
  modal.insertAdjacentHTML('beforebegin', HTMLString)

  let confirmModal = document.getElementById('confirm-modal')
  let container


  backdrop.style.visibility = 'visible'
  confirmModal.showModal()

  let cancelDelete = ()=>{
    document.getElementById('confirm-modal').style.visibility = 'hidden'
    confirmModal.close()
    if(modal.style.visibility !== 'visible'){
      backdrop.style.visibility='hidden'
    }
    confirmModal.remove()
  }

  let confirmDelete = ()=>{
    if(localStorage.getItem('viewMode') === 'list'){
      container = document.getElementById(`group-${id}`).parentElement
    }else{
      container = document.getElementById(`group-${id}`)
    }

    let dataArrIndex = loanData.findIndex((item)=>
      item.id === id
    );
    container.remove();
    loanData.splice(dataArrIndex, 1);
    localStorage.setItem("LPMdata", JSON.stringify(loanData))
    modal.innerHTML=''
    modal.style.visibility='hidden'
    backdrop.style.visibility='hidden'
    confirmModal.close()
    confirmModal.remove()
  }


  document.getElementById('no-btn').addEventListener('click', cancelDelete)
  document.getElementById('yes-btn').addEventListener('click', confirmDelete)
}

function listView(){
  const toggleView = document.getElementById('view-toggle').children
  const listView = toggleView[0]
  const gridView = toggleView[1]

  if(selectMode){
    document.getElementById('multiselect-actions').remove()

    localStorage.setItem('viewMode', 'list')
    loanContainer.classList.replace('grid', 'list')

    selectListRender()
  }else{

    Array.from(toggleView).forEach((el)=>{
      el.classList.remove('active-view')})

    if(!listView.classList.contains('active-view')){
      loanContainer.classList.replace('grid', 'list')
      updateList()
      localStorage.setItem('viewMode', 'list')
    }
  }
  listView.classList.add('active-view')
  gridView.classList.remove('active-view')
}

function gridView(){
  const toggleView = document.getElementById('view-toggle').children
  const gridView = toggleView[1]
  const listView = toggleView[0]

  if(selectMode){

    localStorage.setItem('viewMode', 'grid')
    loanContainer.classList.replace('list', 'grid')

    selectGridRender()
  }else{

    Array.from(toggleView).forEach((el)=>{
      el.classList.remove('active-view')})

    if(!gridView.classList.contains('active-view')){
      loanContainer.classList.replace('list', 'grid')
      updateGrid()
      localStorage.setItem('viewMode', 'grid')
    }
  }
  gridView.classList.add('active-view')
  listView.classList.remove('active-view')
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

function exitMultiselect(){

  let elements = document.querySelectorAll('.selectable')
  elements.forEach((el)=>{
    el.remove()
  })
  let viewMode = localStorage.getItem('viewMode')
  selectedItemsArray = null
  selectMode=false;
  document.getElementById('multi-select').classList.remove('active-view')
  console.log('line has run')
  document.getElementById('multiselect-actions') ? document.getElementById('multiselect-actions').remove() : null;
  viewMode === 'list' ? listView() : gridView()

}

function deleteMultiselect(){
  if(selectedItemsArray){
    selectedItemsArray.forEach((item)=>{
      let identifier = item.split('-')[1]
      let dataArrIndex = loanData.findIndex((item) => {
        item.id === identifier
      })

      loanData.splice(dataArrIndex, 1);
      document.getElementById(`${item}`).remove()
    })

    selectedItemsArray = null
    countElement.innerHTML=``
    localStorage.setItem("LPMdata", JSON.stringify(loanData))

    let viewMode = localStorage.getItem('viewMode')
    viewMode === 'list' ? listView() : gridView()

    document.getElementById('multiselect-actions').remove()
    document.getElementById('multi-select').classList.remove('active-view')
  }else{
    let counter = document.getElementById('selected-count')

    counter.classList.add('noneSelected')
    setTimeout(() => {
      counter.classList.remove('noneSelected');
    }, 800)
  }
}

function selectGridItem(element){
  if(!selectedItemsArray){
    selectedItemsArray = []
    countElement = document.getElementById('selected-count')
  }
  if(selectedItemsArray.includes(element.id)){
    element.classList.remove('selected')
    selectedItemsArray = selectedItemsArray.filter(i => i !== element.id)
    countElement.innerHTML = selectedItemsArray.length ? `${selectedItemsArray.length} selected` : ` 0 selected`
  }else{
    selectedItemsArray.push(element.id)
    element.classList.add('selected')
    countElement.innerHTML = `${selectedItemsArray.length} selected`
  }
}

function selectListItem(element){
  let targetItem = element
  if(!selectedItemsArray){
    selectedItemsArray = []
    countElement = document.getElementById('selected-count')
  }
  if(selectedItemsArray.includes(targetItem.id)){
    selectedItemsArray = selectedItemsArray.filter(i=> i !== targetItem.id)
    countElement.innerHTML = selectedItemsArray.length ? `${selectedItemsArray.length} selected` : '0 selected'
  }else{
    selectedItemsArray.push(targetItem.id)
    countElement.innerHTML = `${selectedItemsArray.length} selected`
  }
}

function selectGridRender(){
  loanContainer.innerHTML = ''//clear the container
  selectMode = true;
  loanData.forEach(({id, loanName, balance, rate, minPayment, order, loanType})=>{//re-render to be selectable
    let HTMLString = `
    <div class="selectable loan" id="group-${id}">
      <span><strong>Loan Name:</strong></span>
      <p>${loanName}</p>
      <span><strong>Balance:</strong></span>
      <p>$${Number.parseFloat(balance).toFixed(2)}</p>
      <span><strong>Interest Rate: </strong></span>
      <p>${Number.parseFloat(rate).toFixed(2)}%</p>
      <span><strong>Minimum Payment: </strong></span>
      <p>$${Number.parseFloat(minPayment).toFixed(2)}</p>
      <span><strong>Payment Order</strong></span>
      <p>${order}</p>
     </div>`

    loanContainer.insertAdjacentHTML(`beforeend`, HTMLString)//insert after last item

    if(selectedItemsArray && selectedItemsArray.includes(`group-${id}`)){//Preserve selections going from list to grid view
      document.getElementById(`group-${id}`).classList.add('selected')
    }

    let element = document.getElementById(`group-${id}`)//reference the recently added item
    let selectHandler = ()=>{
      selectGridItem(element)//pass the recent element to the function
    }
    element.addEventListener('click', selectHandler)//add a listener, make it selectable
  })

  //after all items are added, inject the tool elements
  HTMLString = `
  <ul id='multiselect-actions'>
      <li id='exit-multiselect'>Cancel</li>
      <li id="delete-multiselect" disabled>Delete</li>
      <li id="selected-count"> ${selectedItemsArray ? selectedItemsArray.length : 0} selected</li>
  </ul>`
  utilities.insertAdjacentHTML('beforeend', HTMLString)//insert at the end of the toolbar
  document.getElementById('exit-multiselect').addEventListener('click',exitMultiselect)//add the button listeners
  document.getElementById('delete-multiselect').addEventListener('click', deleteMultiselect)

}

function selectListRender(){
  selectMode = true;
  loanContainer.innerHTML =`
    <table id="loan-List">
      <tr id="header">
        <th>Loan Name</th>
        <th>Balance</th>
        <th>Interest Rate</th>
        <th>Minimum Payment</th>
        <th>Payment Order</th>
        <th>
          <label class="checkbox-container">
            <input type="checkbox" class="checkbox" id="select-all"></input>
            <span class="checkmark"></span>
          </label>
        </th>
      </tr>
    </table>`
  let loanList =  document.getElementById('loan-List') //the list items container
  let HTMLString;

  loanData.forEach(
    ({id, loanName, balance, rate, minPayment, order, loanType}) =>{

      HTMLString =`
      <tr class="loan selectable-row" id='group-${id}'>
        <td>${loanName}</td>
        <td>$${Number.parseFloat(balance).toFixed(2)}</td>
        <td>${Number.parseFloat(rate).toFixed(2)}%</td>
        <td>$${Number.parseFloat(minPayment).toFixed(2)}</td>
        <td>${order}</td>
        <td>
          <label class="checkbox-container">
            <input class="checkbox" id="check-${id}" type="checkbox"></input>
            <span class="checkmark"></span>
          </label>
        </td>
      </tr>`
      loanList.insertAdjacentHTML('beforeend', HTMLString)

      if(selectedItemsArray && selectedItemsArray.includes(`group-${id}`)){
        let row = document.getElementById(`group-${id}`)
        let checkbox = row.querySelector('.checkbox')
        checkbox.checked = !checkbox.checked
        row.classList.toggle('selected', checkbox.checked)
      }
    })

    let selectHandler = (e)=>{
      let row = e.target.closest('tr.selectable-row')

      if(!row) return;

      if(
        e.target.closest('label.checkbox-container') ||
        e.target.tagName === 'INPUT'
      )row.classList.toggle('selected');

      const checkbox = row.querySelector('.checkbox')
      checkbox.checked = !checkbox.checked;

      row.classList.toggle('selected', checkbox.checked)
      selectListItem(row)
    }
    loanList.addEventListener('click', (e)=>{
      selectHandler(e)
    })

    HTMLString = `
    <ul id='multiselect-actions'>
        <li id='exit-multiselect'>Cancel</li>
        <li id="delete-multiselect" disabled>Delete</li>
        <li id="selected-count"> ${selectedItemsArray ? selectedItemsArray.length : 0} selected</li>
    </ul>`
    utilities.insertAdjacentHTML('beforeend', HTMLString)//insert at the end of the toolbar
    document.getElementById('exit-multiselect').addEventListener('click',exitMultiselect)//add the button listeners
    document.getElementById('delete-multiselect').addEventListener('click', deleteMultiselect)
}

//reload all local storage data to the display field
window.addEventListener('DOMContentLoaded', (e)=>{
  updateLoanContainer()
  viewListeners()
  toolListeners()
})