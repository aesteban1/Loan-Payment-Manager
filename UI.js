const elements = {
  loanContainer: document.querySelector(".loan-container"),
  modal: document.getElementById("blank-modal"),
  backdrop: document.getElementById("overlay"),
  utilities: document.getElementById("utilities"),
  toolsContainer: document.getElementById("tools"),
  viewToggleContainer: document.getElementById("view-toggle"),
};
let selectedItemsArray = null;
let selectMode = false;
let countElement;
let allSelected = false;

const loanData = JSON.parse(localStorage.getItem("LPMdata")) || [];
let currentData = {};

function toolListeners() {
  let selectHandler = (el) => {
    let viewMode = localStorage.getItem("viewMode");
    if (!el.classList.contains("active-view")) {
      viewMode === "list" ? renderSelectList() : selectGridRender();
      el.classList.add("active-view");
    } else {
      exitMultiselect();
    }
  };

  let filterHandler = () => {
    //IMPLEMENT FILTER TOOL
    console.log("filter tool clicked!");
  };

  let duplicateHandler = () => {
    //IMPLEMENT DUPLICATE TOOL
    console.log("duplicate tool clicked!");
  };

  elements.toolsContainer.addEventListener("click", (event) => {
    let target = event.target.closest("li");
    if (target.id === "multi-select") {
      selectHandler(target);
    } else if (target.id === "filter-entries") {
      filterHandler(); //NEED PARAMETER?
    } else if (target.id === "duplicate-entry") {
      duplicateHandler(); //NEED PARAMETER?
    }
  });
}

function viewListeners() {
  elements.viewToggleContainer.addEventListener("click", (event) => {
    let target = event.target.closest("li");
    if (
      target.id === "list-view" &&
      !target.classList.contains("active-view")
    ) {
      listView();
    } else if (
      target.id === "grid-view" &&
      !target.classList.contains("active-view")
    ) {
      gridView();
    }
  });
}
//Creates new id for a new list item
function newEntry() {
  let identifier = Date.now();
  openNewModal(identifier);
}
//All HTML onclick should be turned to JS eventListeners. Little at a time.
function openEditModal(dataObj) {
  let UpdatedDataObj;

  let editHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(elements.modal);

    UpdatedDataObj = {
      id: dataObj.id,
      loanName: formData.get("loanName") || dataObj.id,
      balance: formData.get("loanBalance") || 0,
      rate: formData.get("loanRate") || 0,
      minPayment: formData.get("loanMin") || 0,
      order: formData.get("payment order"),
      loanType: formData.get("loan type") || "personal loan",
    };

    updateLocalStorage(UpdatedDataObj);

    if (localStorage.getItem("viewMode") === "list") {
      updateListItem(
        document.getElementById(`group-${dataObj.id}`),
        UpdatedDataObj
      );
    } else {
      updateGridItem(
        document.getElementById(`group-${dataObj.id}`),
        UpdatedDataObj
      );
    }

    elements.modal.removeEventListener("submit", editHandler);
  };

  let cancelEdit = () => {
    elements.modal.innerHTML = "";
    elements.modal.removeEventListener("submit", editHandler);
    elements.modal.style.visibility = "hidden";
    elements.backdrop.style.visibility = "hidden";

    elements.modal.removeEventListener("submit", editHandler);
  };

  let deleteHandler = () => {
    deleteEntry(dataObj.id);
  };

  elements.modal.innerHTML = `
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
      </div>`;

  const cancelButton = document.getElementById(`editModalCancel-${dataObj.id}`);
  const deleteButton = document.getElementById(`editModalDelete-${dataObj.id}`);
  elements.modal.style.visibility = "visible";
  elements.backdrop.style.visibility = "visible";

  deleteButton.addEventListener("click", deleteHandler);
  cancelButton.addEventListener("click", cancelEdit);
  elements.modal.addEventListener("submit", editHandler);
}

function openNewModal(identifier) {
  let newDataObj;

  let handler = (e) => {
    e.preventDefault();
    const formData = new FormData(elements.modal);

    //Need to pass 'identifier' to the handler, so the event listener should be a paramenter function.
    //Use a function with a reference to call the handler function with parameters
    newDataObj = {
      id: identifier,
      loanName: formData.get("loanName") || identifier,
      balance: formData.get("loanBalance") || 0,
      rate: formData.get("loanRate") || 0,
      minPayment: formData.get("loanMin") || 0,
      order: formData.get("payment order"),
      loanType: null,
    };

    updateLocalStorage(newDataObj);

    if (localStorage.getItem("viewMode") === "list") {
      addToList(document.getElementById("loan-list"), newDataObj);
    } else {
      addToGrid(elements.loanContainer, newDataObj);
    }

    elements.modal.removeEventListener("submit", handler);
  };

  let cancelEntry = () => {
    elements.modal.innerHTML = "";
    elements.modal.removeEventListener("submit", handler);
    elements.modal.style.visibility = "hidden";
    elements.backdrop.style.visibility = "hidden";
  };

  elements.modal.innerHTML = `
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
  elements.modal.style.visibility = "visible";
  elements.backdrop.style.visibility = "visible";

  const cancelButton = document.getElementById(`newModalCancel-${identifier}`);
  cancelButton.addEventListener("click", cancelEntry);
  elements.modal.addEventListener("submit", handler);
}

//Displays the user input as regular text
function addToList(loanListContainer, dataObj) {
  updateLocalStorage(dataObj);

  let { id, loanName, balance, rate, minPayment, order, loanType } = dataObj;

  let fields = [
    loanName,
    `$${Number.parseFloat(balance).toFixed(2)}`,
    `${Number.parseFloat(rate).toFixed(2)}%`,
    `$${Number.parseFloat(minPayment).toFixed(2)}`,
    order,
  ];
  let trElement = document.createElement("tr");
  trElement.classList.add('loan')
  trElement.id = `group-${id}`

  fields.forEach((field) => {
    let tdElement = document.createElement("td");
    tdElement.textContent = field;
    trElement.appendChild(tdElement);
  });
  trElement.appendChild(generateDropdown(id));

  loanListContainer.appendChild(trElement);
}

function generateDropdown(identifier) {
  let df = document.createDocumentFragment();

  let dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("dropdown");

  let arrow = document.createElement("button");
  arrow.classList.add("arrow");
  arrow.id = `${identifier}-arrow`;
  dropdownContainer.appendChild(arrow);

  let dropdownContent = document.createElement("ul");
  dropdownContent.classList.add("dropdown-content");

  let options = ["Edit", "Delete"];
  options.forEach((option) => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.classList.add(`${option}-btn`, "menu-item");
    button.textContent = option;
    button.dataset.option = option;
    button.dataset.group = identifier;
    li.appendChild(button);
    dropdownContent.appendChild(li);
  });

  dropdownContent.addEventListener("click", (event) => {
    let target = event.target.closest("button");
    let action = target.dataset.option;
    let dataObj = loanData.findIndex((item) => item.id === identifier);

    if (action === "Edit") {
      openEditModal(dataObj);
    } else if (action === "Delete") {
      deleteEntry(identifier);
    }
  });
  dropdownContainer.appendChild(dropdownContent);
  df.appendChild(dropdownContainer);

  return df;
}

//Renders loan container as a list view from user data
function updateList() {
  elements.loanContainer.replaceChildren(); //start with an empty loan container

  let table = document.createElement("table"); //the table where the items will display
  table.id = "loan-list";

  let htmlString = `
    <thead>
      <tr id="header">
        <th>Loan Name</th>
        <th>Balance</th>
        <th>Interest Rate</th>
        <th>Minimum Payment</th>
        <th>Payment Order</th>
      </tr>
    </thead>`;
  table.insertAdjacentHTML("afterbegin", htmlString); //Simple and static header inserted

  //Populate the table with the list items
  loanData.forEach(({ id, loanName, balance, rate, minPayment, order }) => {
    const tr = document.createElement("tr"); //create a row container
    tr.classList.add("loan");
    tr.id = `group-${id}`;

    const fields = [
      loanName,
      `$${Number.parseFloat(balance).toFixed(2)}`,
      `${Number.parseFloat(rate).toFixed(2)}%`,
      `$${Number.parseFloat(minPayment).toFixed(2)}`,
      order,
    ];

    //loop through the fields to generate table data
    fields.forEach((text) => {
      const td = document.createElement("td"); //create a table data element
      td.textContent = text;
      tr.appendChild(td);
    });

    const tdDropdown = document.createElement("td"); //create dropdown container
    tdDropdown.appendChild(generateDropdown(id)); //insert dropdown content
    tr.appendChild(tdDropdown); //insert the completed dropdown to the row

    table.appendChild(tr); //completed row is added to the table
  });

  table.addEventListener("click", (event) => {
    let target = event.target.closest("button.arrow");
    if (!target) return;
    target.classList.toggle("active");
  });
  elements.loanContainer.appendChild(table); //completed table is added to the loan container
  let newEntryBtn = document.createElement("button");
  newEntryBtn.id = "add-entry";
  newEntryBtn.textContent = "Add Item";
  newEntryBtn.addEventListener("click", newEntry);
  elements.loanContainer.appendChild(newEntryBtn);
}

//displays editable data within in an open modal
function updateListItem(loanEl, dataObj) {
  let openHandler = () => {
    openEditModal(dataObj);
  };

  let deleteHandler = () => {
    deleteEntry(dataObj.id);
  };

  let dropDownHandler = () => {
    dropDown(dataObj.id);
  };

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
          <li><button class="edit-btn menu-item" id='edit-${
            dataObj.id
          }'>Edit</button></li>
          <li><button class="delete-btn menu-item" id='delete-${
            dataObj.id
          }'>Delete</button></li>
        </ul>
      </div>
    </td>`;

  document
    .getElementById(`edit-${dataObj.id}`)
    .addEventListener("click", openHandler);
  document
    .getElementById(`delete-${dataObj.id}`)
    .addEventListener("click", deleteHandler);
  document
    .getElementById(`dropDownMenu-${dataObj.id}`)
    .addEventListener("click", dropDownHandler);

  elements.modal.innerHTML = "";
  elements.backdrop.style.visibility = "hidden";
  elements.modal.style.visibility = "hidden";
}

//Adds an item to the GRID
function addToGrid(container, dataObj) {
  let openHandler = () => {
    openEditModal(dataObj);
  };
  let deleteHandler = () => {
    deleteEntry(dataObj.id);
  };
  let dropDownHandler = () => {
    dropDown(dataObj.id);
  };

  let HTMLString = `
  <div class="loan" id="group-${dataObj.id}">
    <div class="dropdown">
      <button id='dropDownMenu-${dataObj.id}' class="arrow"></button>
      <ul class="dropdown-content">
        <li><button id='edit-${
          dataObj.id
        }' class="edit-btn menu-item">Edit</button></li>
        <li><button id='delete-${
          dataObj.id
        }' class="delete-btn menu-item">Delete</button></li>
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
  </div>`;

  document
    .getElementById("add-entry")
    .insertAdjacentHTML("beforebegin", HTMLString);

  document
    .getElementById(`dropDownMenu-${dataObj.id}`)
    .addEventListener("click", dropDownHandler);
  document
    .getElementById(`edit-${dataObj.id}`)
    .addEventListener("click", openHandler);
  document
    .getElementById(`delete-${dataObj.id}`)
    .addEventListener("click", deleteHandler);

  elements.modal.innerHTML = "";
  elements.modal.style.visibility = "hidden";
  elements.backdrop.style.visibility = "hidden";
}

//Updates the GRID with the most recent data
function updateGrid() {
  elements.loanContainer.innerHTML = ``;
  loanData.forEach(
    ({ id, loanName, balance, rate, minPayment, order, loanType }) => {
      elements.loanContainer.innerHTML += `
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
      </div>`;
    }
  );

  elements.loanContainer.insertAdjacentHTML(
    "beforeend",
    `<button id="add-entry" onclick="newEntry()">+</button>`
  );

  loanData.forEach((dataObj) => {
    let openHandler = () => {
      openEditModal(dataObj);
    };

    let deleteHandler = () => {
      deleteEntry(dataObj.id);
    };

    let dropDownHandler = () => {
      dropDown(dataObj.id);
    };
    document
      .getElementById(`edit-${dataObj.id}`)
      .addEventListener("click", openHandler);
    document
      .getElementById(`delete-${dataObj.id}`)
      .addEventListener("click", deleteHandler);
    document
      .getElementById(`dropDownMenu-${dataObj.id}`)
      .addEventListener("click", dropDownHandler);
  });
}

function updateGridItem(loanEl, dataObj) {
  let openHandler = () => {
    openEditModal(dataObj);
  };
  let deleteHandler = () => {
    deleteEntry(dataObj.id);
  };
  let dropDownHandler = () => {
    dropDown(dataObj.id);
  };

  loanEl.innerHTML = `
    <div class="dropdown">
      <button id='dropDownMenu-${dataObj.id}' class="arrow"></button>
      <ul class="dropdown-content">
        <li><button id='edit-${
          dataObj.id
        }' class="edit-btn menu-item">Edit</button></li>
        <li><button id='delete-${
          dataObj.id
        }' class="delete-btn menu-item">Delete</button></li>
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
    <span><strong>Payment Order</strong></span>
    <p>${dataObj.order}</p>`;

  document
    .getElementById(`dropDownMenu-${dataObj.id}`)
    .addEventListener("click", dropDownHandler);
  document
    .getElementById(`edit-${dataObj.id}`)
    .addEventListener("click", openHandler);
  document
    .getElementById(`delete-${dataObj.id}`)
    .addEventListener("click", deleteHandler);

  elements.modal.innerHTML = "";
  elements.modal.style.visibility = "hidden";
  elements.backdrop.style.visibility = "hidden";
}

//Confirmation, populates data to local storage for future use
function updateLocalStorage(dataObj) {
  const dataArrIndex = loanData.findIndex((item) => item.id === dataObj.id);

  //save the data object
  if (dataArrIndex === -1) {
    loanData.push(dataObj);
  } else {
    loanData[dataArrIndex] = dataObj;
  }

  //Update Local storage with updated data array
  localStorage.setItem("LPMdata", JSON.stringify(loanData));
}

//Display user input as inline text
function updateLoanContainer() {
  elements.loanContainer.replaceChildren();
  if (elements.loanContainer.classList.contains("list")) {
    updateList();
  } else {
    updateGrid();
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".arrow").forEach((el) => {
        el.classList.remove("active");
      });
    }
  });
}

//cancel entry, deletes added container
function cancelEntry() {
  elements.modal.removeEventListener("submit", handler);
  elements.modal.innerHTML = "";
  elements.modal.style.visibility = "hidden";
  elements.backdrop.style.visibility = "hidden";
}

//deletes current container
function deleteEntry(id) {
  let HTMLString = `
  <dialog id='confirm-modal'>Delete Entry?
    <div>
      <button id='no-btn'>Cancel</button>
      <button id='yes-btn'>Delete</button>
    </div>
  </dialog>`;
  elements.modal.insertAdjacentHTML("beforebegin", HTMLString);

  let confirmModal = document.getElementById("confirm-modal");
  let container;

  elements.backdrop.style.visibility = "visible";
  confirmModal.showModal();

  let cancelDelete = () => {
    document.getElementById("confirm-modal").style.visibility = "hidden";
    confirmModal.close();
    if (elements.modal.style.visibility !== "visible") {
      elements.backdrop.style.visibility = "hidden";
    }
    confirmModal.remove();
  };

  let confirmDelete = () => {
    if (localStorage.getItem("viewMode") === "list") {
      container = document.getElementById(`group-${id}`).parentElement;
    } else {
      container = document.getElementById(`group-${id}`);
    }

    let dataArrIndex = loanData.findIndex((item) => item.id === id);
    container.remove();
    loanData.splice(dataArrIndex, 1);
    localStorage.setItem("LPMdata", JSON.stringify(loanData));
    elements.modal.innerHTML = "";
    elements.modal.style.visibility = "hidden";
    elements.backdrop.style.visibility = "hidden";
    confirmModal.close();
    confirmModal.remove();
  };

  document.getElementById("no-btn").addEventListener("click", cancelDelete);
  document.getElementById("yes-btn").addEventListener("click", confirmDelete);
}

function listView() {
  const [listView, gridView] = elements.viewToggleContainer.children;

  if (selectMode) {
    document.getElementById("multiselect-actions").remove();

    localStorage.setItem("viewMode", "list");
    elements.loanContainer.classList.replace("grid", "list");

    renderSelectList();
  } else {
    listView.classList.remove("active-view");
    gridView.classList.remove("active-view");

    elements.loanContainer.classList.replace("grid", "list");
    updateList();
    localStorage.setItem("viewMode", "list");
  }
  listView.classList.add("active-view");
  gridView.classList.remove("active-view");
}

function gridView() {
  const toggleView = document.getElementById("view-toggle").children;
  const gridView = toggleView[1];
  const listView = toggleView[0];

  if (selectMode) {
    localStorage.setItem("viewMode", "grid");
    elements.loanContainer.classList.replace("list", "grid");

    selectGridRender();
  } else {
    Array.from(toggleView).forEach((el) => {
      el.classList.remove("active-view");
    });

    if (!gridView.classList.contains("active-view")) {
      elements.loanContainer.classList.replace("list", "grid");
      updateGrid();
      localStorage.setItem("viewMode", "grid");
    }
  }
  gridView.classList.add("active-view");
  listView.classList.remove("active-view");
}

//Toggle the dropdown
function dropDown(id) {
  let isOpen = document
    .getElementById(`dropDownMenu-${id}`)
    .classList.contains("active");

  document.querySelectorAll(".arrow").forEach((el) => {
    el.classList.remove("active");
  });

  if (!isOpen) {
    document.getElementById(`dropDownMenu-${id}`).classList.add("active");
  } else {
    document.getElementById(`dropDownMenu-${id}`).classList.remove("active");
  }
}

function exitMultiselect() {
  let listItems = document.querySelectorAll(".selectable");
  listItems.forEach((el) => {
    el.remove();
  });
  let viewMode = localStorage.getItem("viewMode");
  selectedItemsArray = null;
  selectMode = false;
  document.getElementById("multi-select").classList.remove("active-view");
  document.getElementById("multiselect-actions")
    ? document.getElementById("multiselect-actions").remove()
    : null;
  viewMode === "list" ? listView() : gridView();
}

function deleteMultiselect() {
  if (selectedItemsArray) {
    selectedItemsArray.forEach((item) => {
      let identifier = item.split("-")[1];
      let dataArrIndex = loanData.findIndex((item) => item.id === identifier);

      loanData.splice(dataArrIndex, 1);
      document.getElementById(`${item}`).remove();
    });

    selectedItemsArray = null;
    countElement.innerHTML = ``;
    localStorage.setItem("LPMdata", JSON.stringify(loanData));

    let viewMode = localStorage.getItem("viewMode");
    viewMode === "list" ? listView() : gridView();

    document.getElementById("multiselect-actions").remove();
    document.getElementById("multi-select").classList.remove("active-view");
  } else {
    let counter = document.getElementById("selected-count");

    counter.classList.add("noneSelected");
    setTimeout(() => {
      counter.classList.remove("noneSelected");
    }, 800);
  }
}

function selectAll() {
  //If initial 'allSelected' value is false we can assume we are adding all items, if initial value is true was are removing all items
  let allCards = allSelected
    ? selectedItemsArray
    : document.querySelectorAll(".loan"); //gather all loan items
  if (!selectedItemsArray) selectedItemsArray = []; //If the array doesn't exist create it

  allSelected = !allSelected;

  let viewMode = localStorage.getItem("viewMode");
  let item;
  let text = document.getElementById("all-multiselect");

  viewMode === "list"
    ? (document.getElementById("select-all").checked = selectAll)
    : null; //toggles master checkmark, based on whether the are selecting or unselecting in listMode
  allCards.forEach((card) => {
    if (allSelected) {
      selectedItemsArray.push(card.id);
      card.querySelector(".checkbox").checked = true;
      card.classList.add("selected");
      text.style.fontSize = "1rem";
      text.innerHTML = "Unselect All";
    } else {
      item = document.getElementById(`${card}`);
      item.classList.remove("selected");
      item.querySelector(`.checkbox`).checked = allSelected;
      document.getElementById("select-all").checked = allSelected;
      text.innerHTML = "Select All";
    }
  });

  if (!allSelected) {
    selectedItemsArray = null;
    allCards = [];
  }

  selectedItemsArray
    ? (document.getElementById(
        "selected-count"
      ).innerHTML = `${selectedItemsArray.length} selected`)
    : (document.getElementById("selected-count").innerHTML = `0 selected`);
}

function selectGridItem(element) {
  if (!selectedItemsArray) {
    selectedItemsArray = [];
    countElement = document.getElementById("selected-count");
  }
  if (selectedItemsArray.includes(element.id)) {
    element.classList.remove("selected");
    selectedItemsArray = selectedItemsArray.filter((i) => i !== element.id);
    document.getElementById("selected-count").innerHTML =
      selectedItemsArray.length
        ? `${selectedItemsArray.length} selected`
        : ` 0 selected`;
  } else {
    selectedItemsArray.push(element.id);
    element.classList.add("selected");
    document.getElementById(
      "selected-count"
    ).innerHTML = `${selectedItemsArray.length} selected`;
  }
}

function selectListItem(element) {
  let targetItem = element;
  if (!selectedItemsArray) {
    selectedItemsArray = [];
    countElement = document.getElementById("selected-count");
  }

  if (selectedItemsArray.includes(targetItem.id)) {
    selectedItemsArray = selectedItemsArray.filter((i) => i !== targetItem.id);
    document.getElementById("selected-count").innerHTML =
      selectedItemsArray.length
        ? `${selectedItemsArray.length} selected`
        : "0 selected";
  } else {
    selectedItemsArray.push(targetItem.id);
    document.getElementById(
      "selected-count"
    ).innerHTML = `${selectedItemsArray.length} selected`;
  }
}

function selectGridRender() {
  elements.loanContainer.innerHTML = ""; //clear the container
  selectMode = true;
  loanData.forEach(
    ({ id, loanName, balance, rate, minPayment, order, loanType }) => {
      //re-render to be selectable
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
     </div>`;

      elements.loanContainer.insertAdjacentHTML(`beforeend`, HTMLString); //insert after last item

      if (selectedItemsArray && selectedItemsArray.includes(`group-${id}`)) {
        //Preserve selections going from list to grid view
        document.getElementById(`group-${id}`).classList.add("selected");
      }

      let element = document.getElementById(`group-${id}`); //reference the recently added item
      let selectHandler = () => {
        selectGridItem(element);
      }; //selector listener for recent element

      element.addEventListener("click", selectHandler);
    }
  ); //add a listener, make it selectable

  //after all items are added, inject the tool actions
  HTMLString = `
  <ul id='multiselect-actions'>
      <li id='exit-multiselect'>Cancel</li>
      <li id="delete-multiselect" disabled>Delete</li>
      <li id="selected-count"> ${
        selectedItemsArray ? selectedItemsArray.length : 0
      } selected</li>
  </ul>`;
  let selectCount = document.getElementById("multiselect-actions") || null;
  if (selectCount) {
    selectCount.remove();
    elements.utilities.insertAdjacentHTML("beforeend", HTMLString); //insert at the end of the toolbar
  } else {
    elements.utilities.insertAdjacentHTML("beforeend", HTMLString);
  } //insert at the end of the toolbar

  document
    .getElementById("exit-multiselect")
    .addEventListener("click", exitMultiselect); //add the button listeners
  document
    .getElementById("delete-multiselect")
    .addEventListener("click", deleteMultiselect);
}

function renderSelectList() {
  elements.loanContainer.innerHTML = `
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
    </table>`;
  selectMode = true;
  let loanList = document.getElementById("loan-List"); //the list items container
  let HTMLString;

  loanData.forEach(
    ({ id, loanName, balance, rate, minPayment, order, loanType }) => {
      HTMLString = `
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
      </tr>`;
      loanList.insertAdjacentHTML("beforeend", HTMLString);

      //preserves selections after display mode change
      if (selectedItemsArray && selectedItemsArray.includes(`group-${id}`)) {
        let row = document.getElementById(`group-${id}`);
        let checkbox = row.querySelector(".checkbox");
        checkbox.checked = !checkbox.checked;
        row.classList.toggle("selected", checkbox.checked);
      }
    }
  );

  let selectHandler = (e) => {
    //Updates styles of a selected/unselected row
    let row = e.target.closest("tr.selectable-row");

    if (!row) return;

    // if (
    //   e.target.closest("label.checkbox-container") ||
    //   e.target.tagName === "INPUT"
    // ){
    //   row.classList.toggle("selected");
    // }

    const checkbox = row.querySelector(".checkbox");
    checkbox.checked = !checkbox.checked;

    row.classList.toggle("selected", checkbox.checked);
    console.log(row, Date.now());
    selectListItem(row); //updates selected items in storage
  };

  loanList.addEventListener("click", (e) => {
    selectHandler(e); //attach listener to the loanlist container
  });

  //after all items are added, inject the tool actions
  HTMLString = `
  <ul id='multiselect-actions'>
      <li id='all-multiselect'>Select All</li>
      <li id='exit-multiselect'>Cancel</li>
      <li id="delete-multiselect" disabled>Delete</li>
      <li id="selected-count"> ${
        selectedItemsArray ? selectedItemsArray.length : 0
      } selected</li>
  </ul>`;
  let selectCount = document.getElementById("multiselect-actions") || null;
  if (selectCount) {
    selectCount.remove();
    elements.utilities.insertAdjacentHTML("beforeend", HTMLString); //insert at the end of the toolbar
  } else {
    elements.utilities.insertAdjacentHTML("beforeend", HTMLString);
  } //insert at the end of the toolbar

  document
    .getElementById("exit-multiselect")
    .addEventListener("click", exitMultiselect); //add the button listeners
  document
    .getElementById("delete-multiselect")
    .addEventListener("click", deleteMultiselect);
  document
    .getElementById("all-multiselect")
    .addEventListener("click", selectAll);
  document.getElementById("select-all").addEventListener("click", selectAll);
}

//reload all local storage data to the display field
window.addEventListener("DOMContentLoaded", (e) => {
  updateLoanContainer();
  viewListeners();
  toolListeners();
});
