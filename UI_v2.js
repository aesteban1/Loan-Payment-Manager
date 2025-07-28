const elements = {
  loanContainer: document.getElementById("loan-container"),
  backdrop: document.getElementById("overlay"),
  utilities: document.querySelector(".utilities"),
  toolsContainer: document.getElementById("tools"),
  viewToggleContainer: document.getElementById("view-toggle"),
};
let selectedItemsArray = null;
let selectMode = false;
let countElement;
let allSelected = false;
let modal;
let generalUseContainer;

const loanData = JSON.parse(localStorage.getItem("LPMdata")) || [];
const viewMode = localStorage.getItem("viewMode") || "empty";
let currentData = {};

function viewListeners() {
  if (
    localStorage.getItem("viewMode") === "list" &&
    !elements.viewToggleContainer
      .querySelector("#list-view")
      .classList.contains("active-view")
  ) {
    elements.viewToggleContainer
      .querySelector("#list-view")
      .classList.add("active-view");
  } else if (
    localStorage.getItem("viewMode") === "grid" &&
    !elements.viewToggleContainer
      .querySelector("#grid-view")
      .classList.contains("active-view")
  ) {
    !elements.viewToggleContainer
      .querySelector("#grid-view")
      .classList.add("active-view");
  }

  elements.viewToggleContainer.addEventListener("click", (event) => {
    let target = event.target.closest("button");
    if (!target) {
      return;
    }

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
    let target = event.target.closest("button");
    if (target.id === "multi-select") {
      selectHandler(target);
    } else if (target.id === "filter-entries") {
      filterHandler(); //NEED PARAMETER?
    } else if (target.id === "duplicate-entry") {
      duplicateHandler(); //NEED PARAMETER?
    }
  });
}

function newEntryListener() {
  let btn = document.querySelector("#addEntryContainer button");
  btn.addEventListener("click", () => {
    createEntry();
  });
}

function showEmpty() {
  elements.loanContainer.replaceChildren();
  elements.loanContainer.classList.add("empty");

  let image = document.createElement("img");
  image.src = "./Assets/Empty List Icon.svg";
  image.alt = "List icon";

  let pElement = document.createElement("img");
  pElement.src = "./Assets/Text_EmptyList.svg";
  image.alt = "Add an entry to view it here.";

  let divElement = document.createElement("div");
  divElement.id = "emptyListIcon";

  divElement.appendChild(image);
  divElement.appendChild(pElement);

  let newEntryBtn = document.createElement("button");
  newEntryBtn.id = "add-entry";
  newEntryBtn.textContent = "Create Entry";
  newEntryBtn.addEventListener("click", createEntry);
  divElement.appendChild(newEntryBtn);

  elements.loanContainer.appendChild(divElement);
}

function addToList(loanListContainer, dataObj) {
  updateLocalStorage(dataObj);

  if (!loanListContainer) {
    elements.loanContainer.replaceChildren();
    loanListContainer = document.createElement("table"); //the table where the items will display
    loanListContainer.id = "loan-list";

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
    loanListContainer.insertAdjacentHTML("afterbegin", htmlString); //Simple and static header inserted
    elements.loanContainer.appendChild(loanListContainer);
  }

  let { id, loanName, balance, rate, minPayment, order, loanType } = dataObj;

  let fields = [
    loanName,
    `$${Number.parseFloat(balance).toFixed(2)}`,
    `${Number.parseFloat(rate).toFixed(2)}%`,
    `$${Number.parseFloat(minPayment).toFixed(2)}`,
    order,
  ];

  let trElement = document.createElement("tr");
  trElement.classList.add("loan");
  trElement.id = `group-${id}`;

  fields.forEach((field) => {
    let tdElement = document.createElement("td");
    tdElement.textContent = field;
    trElement.appendChild(tdElement);
  });
  trElement.appendChild(generateDropdown(id));

  loanListContainer.appendChild(trElement);

  modal.remove();
  elements.backdrop.style.visibility = "hidden";
}

function updateListItem(loanEl, dataObj) {
  let { id, loanName, balance, rate, minPayment, order, loanType } = dataObj;

  let fields = [
    loanName,
    `$${Number.parseFloat(balance).toFixed(2)}`,
    `${Number.parseFloat(rate).toFixed(2)}%`,
    `$${Number.parseFloat(minPayment).toFixed(2)}`,
    order,
  ];

  loanEl.replaceChildren();
  fields.forEach((field) => {
    let tdElement = document.createElement("td");
    tdElement.textContent = field;
    loanEl.appendChild(tdElement);
  });
  loanEl.appendChild(generateDropdown(id));

  modal.remove();
  elements.backdrop.style.visibility = "hidden";
}

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

function createEntry() {
  let identifier = Date.now();
  openNewModal(identifier);
}

function confirmEntry(identifier) {
  //generates the new dataObj from the modal, then calls addToList
  const formData = new FormData(modal);

  newDataObj = {
    id: identifier,
    loanName: formData.get("loanName") || identifier,
    balance: formData.get("loanBalance") || 0,
    rate: formData.get("loanRate") || 0,
    minPayment: formData.get("loanMin") || 0,
    order: formData.get("Payment Order"),
    loanType: formData.get("Loan Type"),
  };

  updateLocalStorage(newDataObj);

  if (elements.loanContainer.classList.contains("empty")) {
    elements.loanContainer.classList.remove("empty");
    elements.loanContainer.classList.add("list");
    localStorage.setItem("viewMode", "list");
  }

  let container =
    localStorage.getItem("viewMode") == "list"
      ? document.getElementById("loan-list")
      : elements.loanContainer;

  if (localStorage.getItem("viewMode") === "list") {
    addToList(container, newDataObj);
  } else {
    addToGrid(container, newDataObj);
  }

  modal.remove();
  elements.backdrop.style.visibility = "hidden";
}

function deleteEntry(identifier) {
  let HTMLString = `
  <dialog id='confirm-modal'>Delete Entry?
    <div>
      <button id='no-btn'>Cancel</button>
      <button id='yes-btn'>Delete</button>
    </div>
  </dialog>`;
  document.body.insertAdjacentHTML("afterbegin", HTMLString);

  let confirmModal = document.getElementById("confirm-modal");
  let container;

  elements.backdrop.style.visibility = "visible";
  confirmModal.showModal();

  let cancelDelete = () => {
    //closes confirm modal and disables backdrop
    document.getElementById("confirm-modal").style.visibility = "hidden";
    confirmModal.close();
    if (modal.style.visibility !== "visible") {
      elements.backdrop.style.visibility = "hidden";
    }
    confirmModal.remove();
  };

  let confirmDelete = () => {
    //Removes element from DOM and if edit modal is open closes it
    if (localStorage.getItem("viewMode") === "list") {
      container = document.getElementById(`group-${identifier}`);
    } else {
      container = document.getElementById(`group-${identifier}`);
    }

    let dataArrIndex = loanData.findIndex((item) => item.id === identifier);
    container.remove();
    loanData.splice(dataArrIndex, 1);
    localStorage.setItem("LPMdata", JSON.stringify(loanData));
    modal ? modal.remove() : null;
    elements.backdrop.style.visibility = "hidden";
    confirmModal.close();
    confirmModal.remove();
    if (loanData.length === 0) {
      showEmpty();
    }
  };

  document.getElementById("no-btn").addEventListener("click", cancelDelete);
  document.getElementById("yes-btn").addEventListener("click", confirmDelete);
}

function updateEntry(event, dataObj) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("blank-modal"));

  UpdatedDataObj = {
    id: dataObj.id,
    loanName: formData.get("loanName") || dataObj.id,
    balance: formData.get("loanBalance") || 0,
    rate: formData.get("loanRate") || 0,
    minPayment: formData.get("loanMin") || 0,
    order: formData.get("Payment Order"),
    loanType: formData.get("Loan Type") || "personal loan",
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

  modal.remove();
  backdrop.style.visibility = "hidden";
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

    if (action === "Edit") {
      openEditModal(identifier);
    } else if (action === "Delete") {
      deleteEntry(identifier);
    }
  });
  dropdownContainer.appendChild(dropdownContent);
  df.appendChild(dropdownContainer);

  return df;
}

function generateSelectMenu(menuName, stringArray, selected = null) {
  let menuContainer = document.createElement("div");
  menuContainer.classList.add("select-menu");

  let menuLabel = document.createElement("label");
  menuLabel.textContent = `${menuName}:`;
  menuLabel.htmlFor = `${menuName}`;
  menuContainer.appendChild(menuLabel);

  let selectElement = document.createElement("select");
  selectElement.id = `${menuName.split(" ").join("-")}`;
  selectElement.name = `${menuName}`;
  selectElement.required = true;

  let placeHolderOption = document.createElement("option");
  placeHolderOption.value = "";
  placeHolderOption.textContent = "-- Select One --";
  placeHolderOption.disabled = true;
  placeHolderOption.selected = true;
  selectElement.appendChild(placeHolderOption);

  stringArray.forEach((string) => {
    let option = document.createElement("option");
    option.value = string;
    option.textContent = string;
    if (selected && selected === string) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });

  menuContainer.appendChild(selectElement);

  return menuContainer;
}

function generateModalContent(heading, buttonOptions) {
  modal = document.createElement("form");
  modal.classList.add("editable-modal");
  modal.id = "blank-modal";

  let headingElement = document.createElement("span");
  headingElement.textContent = heading;

  let nameInput = document.createElement("input");
  nameInput.dataset.cell = "loan name";
  nameInput.type = "text";
  nameInput.id = "loanName";
  nameInput.placeholder = "Loan Name";
  nameInput.classList.add("loan-input");
  nameInput.name = "loanName";
  modal.appendChild(nameInput);

  let balanceInput = document.createElement("input");
  balanceInput.dataset.cell = "balance";
  balanceInput.type = "number";
  balanceInput.min = "1";
  balanceInput.id = "loanBalance";
  balanceInput.placeholder = "Balance ($)";
  balanceInput.classList.add("loan-input");
  balanceInput.name = "loanBalance";
  modal.appendChild(balanceInput);

  let interestInput = document.createElement("input");
  interestInput.dataset.cell = "interest rate";
  interestInput.type = "number";
  interestInput.id = "loanRate";
  interestInput.min = "0";
  interestInput.step = "0.1";
  interestInput.placeholder = "0.00%";
  interestInput.classList.add("loan-input");
  interestInput.name = "loanRate";
  modal.appendChild(interestInput);

  let minPaymentInput = document.createElement("input");
  minPaymentInput.dataset.cell = "minimum payment";
  minPaymentInput.type = "number";
  minPaymentInput.min = "0";
  minPaymentInput.step = "0.01";
  minPaymentInput.placeholder = "$0.00";
  minPaymentInput.classList.add("loan-input");
  // minPaymentInput.value = minPayment || "";
  minPaymentInput.name = "loanMin";
  modal.appendChild(minPaymentInput);

  let menuName = "Payment Order";
  let OrderTypes = ["Interest-First Payments", "Principal-First Payments"];

  modal.appendChild(generateSelectMenu(menuName, OrderTypes));

  menuName = "Loan Type";
  let loanTypes = [
    "Federal Student Loans",
    "Private Student Loans",
    "Credit Card",
    "Car Loan",
    "Mortgage",
    "Personal Loan",
    "Buy Now Pay Later",
    "Home Equity Loan",
    "Medical Debt",
    "Payday/Title Loan",
  ];

  modal.appendChild(generateSelectMenu(menuName, loanTypes));

  let actionsContainer = document.createElement("div"); //Make sure the buttons are generated with respective listeners attached
  actionsContainer.id = "util";

  //Generates buttons for the form depending on the form type
  buttonOptions.forEach((action) => {
    let button = document.createElement("button");
    button.classList.add(`${action}-btn`);
    button.textContent = action;
    button.dataset.action = action;
    if (action == "Update" || action == "Confirm") {
      button.type = "submit";
      button.form = "blank-modal";
    }
    actionsContainer.appendChild(button);
  });

  modal.appendChild(actionsContainer);

  return modal;
}

function openNewModal(identifier) {
  document.body.insertAdjacentElement(
    "afterbegin",
    generateModalContent("Create New Entry", ["Cancel", "Confirm"])
  );

  modal.style.visibility = "visible";
  elements.backdrop.style.visibility = "visible";

  let cancelBtn = modal.querySelector("button[data-action='Cancel']");
  cancelBtn.addEventListener("click", () => {
    modal.remove();
    elements.backdrop.style.visibility = "hidden";
  });

  modal.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!modal.checkValidity()) {
      modal.reportValidity();
      return;
    }
    confirmEntry(identifier);
  });
}

function openEditModal(identifier) {
  document.body.insertAdjacentElement(
    "afterbegin",
    generateModalContent("Edit Existing Entry", ["Delete", "Cancel", "Update"])
  );

  modal.style.visibility = "visible";
  elements.backdrop.style.visibility = "visible";

  let dataObj = loanData.find((item) => item.id === identifier);
  let { id, loanName, balance, rate, minPayment, order, loanType } = dataObj;
  //Populate the edit modal with the appropriate item data

  let fields = [
    { key: "loanName", value: loanName },
    { key: "loanBalance", value: balance },
    { key: "loanRate", value: rate },
    { key: "loanMin", value: minPayment },
    { key: "Payment Order", value: order },
    { key: "Loan Type", value: loanType },
  ];
  fields.forEach(({ key, value }) => {
    let el = modal.querySelector(`[name="${key}"]`);
    el.value = value;
  });

  let cancelBtn = modal.querySelector("button[data-action='Cancel']");
  cancelBtn.addEventListener("click", () => {
    modal.remove();
    elements.backdrop.style.visibility = "hidden";
  });

  let deleteBtn = modal.querySelector("button[data-action='Delete']");
  deleteBtn.addEventListener("click", () => {
    deleteEntry(identifier);
  });

  modal.addEventListener("submit", () => {
    const formData = new FormData(modal);

    let updatedDataObj = {
      id: identifier,
      loanName: formData.get("loanName") || identifier,
      balance: formData.get("loanBalance") || 0,
      rate: formData.get("loanRate") || 0,
      minPayment: formData.get("loanMin") || 0,
      order: formData.get("Payment Order"),
      loanType: formData.get("Loan Type"),
    };

    updateLocalStorage(updatedDataObj);
    updateListItem(
      document.getElementById(`group-${identifier}`),
      updatedDataObj
    );
  });
}

function listView() {
  const [listView, gridView] = elements.viewToggleContainer.querySelectorAll("button");

  if (selectMode) {
    //display change was done while selectMode was on
    document.getElementById("multiselect-actions").remove(); //remove the old counter, since render function will be adding one.

    localStorage.setItem("viewMode", "list"); //Update viewMode in local storage
    elements.loanContainer.classList.replace("grid", "list"); //display chage was made so repalce grid class for list class

    renderSelectList(); //Finally render in select mode
  } else {
    //Display change was made out of select mode
    listView.classList.remove("active-view");
    gridView.classList.remove("active-view"); //clear all viewmodes

    elements.loanContainer.classList.replace("grid", "list");
    updateList();
    localStorage.setItem("viewMode", "list");
  }
  listView.classList.add("active-view");
  gridView.classList.remove("active-view");
}

function updateList() {
  elements.loanContainer.replaceChildren(); //start with an empty loan container
  if (loanData.length === 0) {
    showEmpty();
    return;
  }
  elements.loanContainer.className = "list";
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
}

function gridView() {
  const [listView, gridView] = elements.viewToggleContainer.querySelectorAll("button");

  if (selectMode) {
    localStorage.setItem("viewMode", "grid");
    elements.loanContainer.classList.replace("list", "grid");

    selectGridRender();
  } else {
    listView.classList.remove("active-view");
    gridView.classList.remove("active-view");

    if (!gridView.classList.contains("active-view")) {
      elements.loanContainer.classList.replace("list", "grid");
      updateGrid();
      localStorage.setItem("viewMode", "grid");
    }
  }
  gridView.classList.add("active-view");
  listView.classList.remove("active-view");
}

function generateGridItem(dataObj) {
  let { id, loanName, balance, rate, minPayment, order, loanType } = dataObj;

  let itemContainer = document.createElement("div");
  itemContainer.classList.add("loan");
  itemContainer.id = `group-${id}`;

  itemContainer.appendChild(generateDropdown(id));

  let fields = [
    { label: "Loan Name", value: loanName },
    { label: "Balance", value: Number.parseFloat(balance).toFixed(2) },
    { label: "Interest Rate", value: Number.parseFloat(rate).toFixed(2) },
    {
      label: "Minimum Payment",
      value: Number.parseFloat(minPayment).toFixed(2),
    },
    { label: "Payment Order", value: order },
    { label: "Loan Type", value: loanType },
  ];

  fields.forEach(({ label, value }) => {
    let spanElement = document.createElement("span");
    let strongElement = document.createElement("strong");
    let pElement = document.createElement("p");

    strongElement.textContent = `${label}:`;
    spanElement.appendChild(strongElement);
    pElement.textContent = value;

    itemContainer.appendChild(spanElement);
    itemContainer.appendChild(pElement);
  });
  return itemContainer;
}

function updateGrid() {
  elements.loanContainer.replaceChildren();
  if (loanData.length === 0) {
    showEmpty();
    return;
  }

  elements.loanContainer.className = "grid";

  loanData.forEach((dataObj) => {
    elements.loanContainer.appendChild(generateGridItem(dataObj));
  });

  // let newEntryBtn = document.createElement("button");
  // newEntryBtn.id = "add-entry";
  // newEntryBtn.textContent = "Add Item";
  // newEntryBtn.addEventListener("click", createEntry);
  // elements.loanContainer.appendChild(newEntryBtn);
}

function updateLoanContainer() {
  //Should the empty container have a class of it's own? On display grid svg cannot be centered in the loan container, but it can in the list view. I wonder...
  elements.loanContainer.replaceChildren();
  let viewMode = localStorage.getItem("viewMode");
  if (loanData.length === 0) {
    showEmpty();
  } else if (
    elements.loanContainer.classList.contains("list") ||
    viewMode == "list"
  ) {
    updateList();
  } else if (
    elements.loanContainer.classList.contains("grid") ||
    viewMode == "grid"
  ) {
    updateGrid();
  }

  //Clicking off of a dropdown will close the dropdown.
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".arrow").forEach((el) => {
        el.classList.remove("active");
      });
    }
  });
}

function renderSelectableList() {
  let loanListContainer = document.createElement("table");
  loanListContainer.id = "loan-list";

  const boilerplate = `
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
      </tr>`;
  loanListContainer.insertAdjacentHTML("afterbegin", boilerplate);
  selectMode = true;

  loanData.forEach(
    ({ id, loanName, balance, rate, minPayment, order, loanType }) => {
      //builds the table with saved selections
      let trElement = document.createElement("tr");
      trElement.classList.add("loan", "selectable-row");
      trElement.id = `group-${id}`;

      let fields = [loanName, balance, rate, minPayment, order];

      fields.forEach((field) => {
        let tdElement = document.createElement("td");
        tdElement.textContent = field;
        trElement.appendChild(tdElement);
      });

      let tdElement = document.createElement("td");
      let checkLabel = document.createElement("label");
      checkLabel.className = "checkbox-Container";

      let inputElement = document.createElement("input");
      inputElement.type = "checkbox";
      inputElement.className = "checkbox";
      inputElement.id = `check-${id}`;

      let spanElement = document.createElement("span");
      spanElement.className = "checkmark";

      checkLabel.appendChild(inputElement);
      checkLabel.appendChild(spanElement);
      tdElement.appendChild(checkLabel);
      trElement.appendChild(tdElement);

      if (selectedItemsArray && selectedItemsArray.includes(`group-${id}`)) {
        let checkbox = trElement.querySelector(".checkbox");
        checkbox.checked = !checkbox.checked;
        trElement.classList.toggle("selected", checkbox.checked);
      }
      loanListContainer.appendChild(trElement);
    });

  let selectHandler = (event) => {
    let row = event.target.closest("tr.selectable-row");
    if (!row) return;

    const checkbox = row.querySelector(".checkbox");
    checkbox.checked = !checkbox.checked;

    row.classList.toggle("selected", checkbox.checked);

    selectListItem(row); //Still need to implement this function
  };

  loanListContainer.addEventListener("click", (e) => {
    selectHandler(e);
  });

  elements.loanContainer.appendChild(loanListContainer);

  //If actions container is in the DOM already it will be removed and re-added for listener attachment purposes
  let existingActionsContainer = document.getElementById("multiselect-actions");
  existingActionsContainer ? existingActionsContainer.remove() : null;

  //after all items are accounted for, inject the tool actions
  let ulElement = document.createElement("ul");
  ulElement.id = "multiselect-actions";

  let listItems = [
    { id: "all-multiselect", content: "Select All" , listener:selectAll},
    { id: "exit-multiselect", content: "Cancel" , listener:exitMultiselect},
    { id: "delete-multiselect", content: "Delete", listener:deleteMultiselect},
    {
      id: "selected-count",
      content: `${selectedItemsArray ? selectedItemsArray.length : 0} selected`,
    },
  ];

  listItems.forEach((item) => {
    const liELement = document.createElement("li");

    if(item.listener){
      let btnElement = document.createElement("button");
      btnElement.id = item.id;
      btnElement.textContent = item.content;
      liELement.appendChild(btnElement)
    }else{
      const spanElement = document.createElement("span");
      spanElement.id = item.id;
      spanElement.textContent = item.content;
      liELement.appendChild(spanElement)
    }

    ulElement.appendChild(li);
  });



  elements.utilities.appendChild(ulElement);
}
window.addEventListener("DOMContentLoaded", (e) => {
  updateLoanContainer();
  viewListeners();
  toolListeners();
  newEntryListener();
});
