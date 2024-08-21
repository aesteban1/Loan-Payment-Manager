let loanContainer = document.querySelector('.loan-container')
let addEntryButton = document.getElementById('add-entry')
let updateLoansBtn = document.getElementById('update-loans')


function addEntry(){
  const entryNumber = loanContainer.querySelectorAll(".loan").length+1

  const HTMLString = 
  `<div class="loan">
  <label for="name-group-${entryNumber}">Loan Name</label>
  <input type="text" placeholder="Loan Name" id="name-group-${entryNumber}" class="loan-input"></input>
  <label for="balance-group-${entryNumber}">Balance</label>
  <input type="number" min="1" placeholder="Loan Balance" value="0" id="balance-group-${entryNumber}" class="loan-input"></input>
  <label for="rate-group-${entryNumber}">Interest Rate</label>
  <input type="number" min="0" step="0.1" value ="0" placeholder="Interest Rate" id="rate-group-${entryNumber}" class="loan-input"></input>
  </div>`

  addEntryButton.insertAdjacentHTML('beforebegin', HTMLString)
}

addEntryButton.addEventListener("click", addEntry)