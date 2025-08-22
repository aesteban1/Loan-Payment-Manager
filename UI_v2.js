const elements = {
  loanContainer: document.getElementById("loan-container"),
  backdrop: document.getElementById("overlay"),
  toolsContainer: document.getElementById("tools"),
  viewToggleContainer: document.getElementById("view-toggle"),
  tableToolbar: document.getElementById("table-toolbar"),
  // utilities: document.querySelector(".utilities")
};
let selectedItemsArray = null;
let selectMode = false;
let allSelected = false;
let modal; //This item is generated, and deleted constantly.
let columnMap = new Map();
let initColumnConfig = [
  {column:"loanName", status: true},
  {column:"balance", status: true},
  {column:"rate", status: true},
  {column:"minPayment", status: true},
  {column:"order", status: true},
  {column:"loanType", status: false},
];
const loanData = JSON.parse(localStorage.getItem("LPMdata")) || [];
let viewMode = localStorage.getItem("viewMode") || "empty";

const svgArray = {
  loanType: {
    "Private Student Loan":
      '<svg class="iconType" width="50" height="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 21h-3l1-3h1l1 3zm-12.976-4.543l8.976-4.575v6.118c-1.007 2.041-5.607 3-8.5 3-3.175 0-7.389-.994-8.5-3v-6.614l8.024 5.071zm11.976.543h-1v-7.26l-10.923 5.568-11.077-7 12-5.308 11 6.231v7.769z"/></svg>',
    "Federal Student Loan":
      '<svg class="iconType" width="50" height="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M1 24h-1v-2h.998l.014-9h3.988v-3h2v3h2v-3h2v3h2v-3h2v3h2v-3h2v3h4v9h1v2h-23zm20-7h-18v5h2v-3c0-.552.448-1 1-1s1 .448 1 1v3h2v-3c0-.552.448-1 1-1s1 .448 1 1v3h2v-3c0-.552.448-1 1-1s1 .448 1 1v3h2v-3c0-.552.448-1 1-1s1 .448 1 1v3h2v-5zm-6-15h-3v1c2.966 0 6.158 1.979 7 6h-14c.547-3.78 3.638-5.827 6-6v-3h4v2z"/></svg>',
    "Credit Card":
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M0 8v-2c0-1.104.896-2 2-2h20c1.104 0 2 .896 2 2v2h-24zm24 3v7c0 1.104-.896 2-2 2h-20c-1.104 0-2-.896-2-2v-7h24zm-15 5h-6v1h6v-1zm3-2h-9v1h9v-1zm9 0h-3v1h3v-1z"/></svg>',
    "Car Loan":
      '<svg class="iconType" width="50" height="50" class="iconType" viewBox="0 0 24 24"><path d="M23.5 7a.5.5 0 0 1 .5.5v.511c0 .793-.926.989-1.616.989l-1.086-2zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981V20a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-13v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1.847C1.392 16.705.995 15.542.995 14.172c0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889C8.681 3.09 10.067 3 12 3s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252M6 13.5a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 6 13.5m10 1a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m2.941-5.527s-.74-1.826-1.631-3.142a1.34 1.34 0 0 0-.869-.566c-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359a1.33 1.33 0 0 0-.869.566c-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497M21 13.5a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 21 13.5M2.702 7H.5a.5.5 0 0 0-.5.5v.511C0 8.804.926 9 1.616 9z"/></svg>',
    Mortgage:
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="45" viewBox="0 0 24 24"><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/></svg>',
    "Personal Loan":
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="45" viewBox="0 0 24 24"><path d="M19 7.001c0 3.865-3.134 7-7 7s-7-3.135-7-7c0-3.867 3.134-7.001 7-7.001s7 3.134 7 7.001zm-1.598 7.18c-1.506 1.137-3.374 1.82-5.402 1.82-2.03 0-3.899-.685-5.407-1.822-4.072 1.793-6.593 7.376-6.593 9.821h24c0-2.423-2.6-8.006-6.598-9.819z"/></svg>',
    "Buy Now Pay Later":
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="45" viewBox="0 0 24 24"><path d="M11 6v8h7v-2h-5v-6h-2zm10.854 7.683l1.998.159c-.132.854-.351 1.676-.652 2.46l-1.8-.905c.2-.551.353-1.123.454-1.714zm-2.548 7.826l-1.413-1.443c-.486.356-1.006.668-1.555.933l.669 1.899c.821-.377 1.591-.844 2.299-1.389zm1.226-4.309c-.335.546-.719 1.057-1.149 1.528l1.404 1.433c.583-.627 1.099-1.316 1.539-2.058l-1.794-.903zm-20.532-5.2c0 6.627 5.375 12 12.004 12 1.081 0 2.124-.156 3.12-.424l-.665-1.894c-.787.2-1.607.318-2.455.318-5.516 0-10.003-4.486-10.003-10s4.487-10 10.003-10c2.235 0 4.293.744 5.959 1.989l-2.05 2.049 7.015 1.354-1.355-7.013-2.184 2.183c-2.036-1.598-4.595-2.562-7.385-2.562-6.629 0-12.004 5.373-12.004 12zm23.773-2.359h-2.076c.163.661.261 1.344.288 2.047l2.015.161c-.01-.755-.085-1.494-.227-2.208z"/></svg>',
    "Home Equity Loan": `
    <svg class="iconType" width="50" height="45" fill="none" viewBox="0 0 55 60">
    <path d="M39.176 2.172a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v13l-7-7zM25.76.586a2 2 0 0 1 2.83 0l25.17 25.17c1.26 1.26.369 3.415-1.413 3.415h-5.171v28.988a1 1 0 0 1-1.013 1l-38-.475a1 1 0 0 1-.987-1V29.17H2.004C.222 29.17-.67 27.017.59 25.757zm.178 19.777v2.864q-2.418.142-4.363.99-2.325 1.02-3.642 2.846-1.305 1.814-1.292 4.238-.012 2.983 1.927 4.71 1.95 1.716 5.332 2.449l2.038.44v4.671a5 5 0 0 1-1.33-.35q-.946-.411-1.467-1.206t-.584-1.964h-6.563q.013 3.195 1.367 5.245 1.368 2.039 3.829 3.02 2.076.824 4.748.956v2.91h2.038v-2.91q2.6-.119 4.537-.881 2.31-.908 3.555-2.648 1.242-1.74 1.254-4.25a7.8 7.8 0 0 0-.472-2.685 6.2 6.2 0 0 0-1.404-2.212q-.958-.994-2.461-1.728-1.504-.733-3.617-1.18l-1.392-.3v-4.44q.913.155 1.454.613.832.696.933 1.939h6.612q-.013-2.498-1.243-4.362-1.218-1.877-3.468-2.91-1.86-.851-4.288-1v-2.865zm2.038 19.054q.395.127.709.26.832.349 1.192.797.374.435.386 1.02a1.8 1.8 0 0 1-.398 1.105q-.385.485-1.131.759a4 4 0 0 1-.758.19zm-2.038-6.525q-.116-.037-.224-.075-.66-.236-1.082-.522a2 2 0 0 1-.621-.658 1.63 1.63 0 0 1-.161-.833 1.7 1.7 0 0 1 .335-.994q.323-.435.994-.684.333-.128.759-.193z"/>
    </svg>`,
    "Medical Debt":
      '<svg class="iconType" width="50" height="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M18.905 14c-2.029 2.401-4.862 5.005-7.905 8-5.893-5.8-11-10.134-11-14.371 0-6.154 8.114-7.587 11-2.676 2.865-4.875 11-3.499 11 2.676 0 .784-.175 1.572-.497 2.371h-6.278c-.253 0-.486.137-.61.358l-.813 1.45-2.27-4.437c-.112-.219-.331-.364-.576-.38-.246-.016-.482.097-.622.299l-1.88 2.71h-1.227c-.346-.598-.992-1-1.732-1-1.103 0-2 .896-2 2s.897 2 2 2c.74 0 1.386-.402 1.732-1h1.956c.228 0 .441-.111.573-.297l.989-1.406 2.256 4.559c.114.229.343.379.598.389.256.011.496-.118.629-.337l1.759-2.908h8.013v2h-5.095z"/></svg>',
    "Payday/Title Loan":
      '<svg class="iconType" width="50" height="45" class="iconType" viewBox="0 0 60 50"><path d="M48.063 6.925c-6.354 0-11.451 5.166-11.451 11.52 0 6.318 5.13 11.449 11.451 11.449 6.319 0 11.485-5.13 11.485-11.485A11.47 11.47 0 0 0 48.063 6.925m.86 17.75v1.8H47.34V24.73c-1.371 0-2.754-.363-3.422-.736l.58-2.322c.735.363 1.89.792 3.114.792 1.312 0 1.96-.576 1.96-1.369 0-.794-.624-1.122-2.143-1.71-2.105-.737-3.42-1.8-3.42-3.692 0-1.746 1.156-3.115 3.275-3.546v-1.892h1.584v1.8c1.315 0 2.267.272 2.967.647l-.644 2.264c-.523-.213-1.371-.576-2.538-.576-1.168 0-1.8.576-1.8 1.155 0 .792.736 1.1 2.322 1.744 2.161.792 3.171 1.891 3.171 3.691 0 1.803-1.099 3.172-3.422 3.694m-4.157 7.637H33.75V22.47c0-4.796-4.19-8.672-8.906-8.672H10.078c-5.177 0-9.612 4.486-9.61 8.906V40.75c-.006 2 1.407 3.044 2.813 3.047 1.409.002 2.813-1.043 2.813-3.047V23.172h1.875v20.625H26.25V23.172h1.875l.019 11.805c-.012 2.046 1.251 2.918 2.56 2.96h14.062c3.834 0 3.834-5.624 0-5.624M17.348.203a6.046 6.046 0 0 0-6.07 6.07 6.06 6.06 0 0 0 6.07 6.073c3.34 0 6.05-2.69 6.073-6.073 0-3.36-2.712-6.07-6.073-6.07"/></svg>',
  },
};

let column_view_svg = `
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="5.75" height="23.75" rx="1" stroke="#A9A9A9" stroke-width="1" stroke-linecap="round" stroke-dasharray="2 2"/>
                  <rect x="10" y="1" width="6" height="24" rx="1" fill="#A9A9A9"/>
                  <rect x="19" y="1" width="6" height="24" rx="1" fill="#A9A9A9"/>
                </svg>`;

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
    elements.viewToggleContainer
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

let selectHandler = () => {
  document
    .getElementById("multiselect-actions")
    .addEventListener("click", (event) => {
      let target = event.target.closest("li button");
      if (!target) return;

      switch (target.id) {
        case "exit-multiselect":
          exitMultiselect();
          break;
        case "all-multiselect":
          selectAll();
          break;
        case "delete-multiselect":
          deleteSelections();
          break;
        default:
          return;
          break;
      }
    });
};

function toolListeners() {
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
    if (!target) return;
    if (loanData.length === 0) return;

    switch (target.id) {
      case "multi-select":
        if (target.classList.contains("active-view")) {
          exitMultiselect();
        } else {
          localStorage.getItem("viewMode") === "list"
            ? renderSelectableList()
            : renderSelectableGrid();
          selectHandler();
          target.className = "active-view";
        }
        break;
      case "filter-entries":
        filterHandler();
        break;
      case "duplicate-entry":
        duplicateHandler();
        break;
      default:
        break;
    }
  });
}

function newEntryListener() {
  let btn = document.querySelector("#addEntryContainer button");
  btn.addEventListener("click", () => {
    createEntry();
  });
}

function clickDelegator(event) {
  let target = event.target.closest("button.arrow");
  if (!target) return;
  let els = Array.from(elements.loanContainer.querySelectorAll("button.arrow"));
  els.forEach((el) => {
    el.classList.remove("active");
  });

  target.classList.toggle("active");
}

function gridSelectDelegator(event) {
  let target = event.target.closest("div.loan");
  if (!target) return;
  let maxItems = document.querySelectorAll(".loan").length;
  let selected = document.getElementById("select-count");

  if (selectedItemsArray.includes(target.id)) {
    target.classList.remove("selected");
    selectedItemsArray = selectedItemsArray.filter((i) => i !== target.id);
    selected.textContent = `${selectedItemsArray.length} selected`;
    if (selectedItemsArray.length < maxItems) {
      document.getElementById("all-multiselect").textContent = "Select All";
      allSelected = false;
    }
  } else if (!selectedItemsArray.includes(target.id)) {
    target.classList.add("selected");
    selectedItemsArray.push(target.id);

    selected.textContent = `${selectedItemsArray.length} selected`;
    if (
      selectedItemsArray.length > 0 &&
      selectedItemsArray.length === maxItems
    ) {
      document.getElementById("all-multiselect").textContent = "Unselect All";
      allSelected = true;
    }
  }
}

function listSelectDelegator(event) {
  let row = event.target.closest("*");
  if (row.tagName == "SPAN" || row.closest("tr").id == "header") return;

  let maxItems = document.querySelectorAll(".loan").length;
  let selected = document.getElementById("select-count");
  let allBtn = document.getElementById("all-multiselect");

  if (row.tagName === "TD") {
    row = row.closest(".selectable-row");
    const checkbox = row.querySelector(".checkbox");
    checkbox.checked = !checkbox.checked;
  }

  if (row.tagName === "INPUT") {
    row = row.closest(".selectable-row");
  }

  if (selectedItemsArray.includes(row.id)) {
    selectedItemsArray = selectedItemsArray.filter((i) => i !== row.id); //Remove item
    row.classList.remove("selected");
  } else {
    selectedItemsArray.push(row.id); //Add element
    row.classList.add("selected");
  }
  console.log(selectedItemsArray);

  selected.textContent = `${selectedItemsArray.length} selected`;

  if (selectedItemsArray.length === maxItems) {
    allBtn.textContent = "Unselect All";
    allSelected = true;
  } else {
    allBtn.textContent = "Select All";
    allSelected = false;
  }
}

function showEmpty() {
  elements.loanContainer.replaceChildren();
  elements.loanContainer.className = "";
  elements.loanContainer.className = "empty";

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

  //If an item is added with an initially empty table, build the table first
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

  loanListContainer.appendChild(generateListItem(dataObj));

  modal.remove();
  elements.backdrop.style.visibility = "hidden";
}

function addToGrid(loanGridContainer, dataObj) {
  loanGridContainer.appendChild(generateGridItem(dataObj, false));

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
    order
      .split(/[-\s]/)
      .filter((word) => word !== "Payments")
      .join(" "),
  ];

  loanEl.replaceChildren();
  fields.forEach((field) => {
    let tdElement = document.createElement("td");
    tdElement.textContent = field;
    loanEl.appendChild(tdElement);
  });
  let tdElement = document.createElement("td");
  tdElement.appendChild(generateDropdown(id));
  loanEl.appendChild(tdElement);

  modal.remove();
  elements.backdrop.style.visibility = "hidden";
}

function updateGridItem(infoContainer, dataObj) {
  infoContainer.replaceWith(generateGridItem(dataObj, false));
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
  menuLabel.textContent = `${menuName}: `;
  menuLabel.htmlFor = `${menuName}`;
  menuLabel.className = "inputLabel";
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

  let headingElement = document.createElement("h2");
  headingElement.textContent = heading;
  modal.appendChild(headingElement);
  let nameInput = document.createElement("input");
  let nameLabel = document.createElement("label");
  let divElement = document.createElement("div");
  nameLabel.htmlFor = "loanName: ";
  nameLabel.textContent = "Loan Name";
  nameLabel.className = "inputLabel";
  nameInput.dataset.cell = "loan name";
  nameInput.type = "text";
  nameInput.maxLength = 26;
  nameInput.id = "loanName";
  nameInput.classList.add("loan-input", "text");
  nameInput.name = "loanName";
  divElement.appendChild(nameLabel);
  divElement.appendChild(nameInput);
  modal.appendChild(divElement);

  let balanceInput = document.createElement("input");
  nameLabel = document.createElement("label");
  divElement = document.createElement("div");
  nameLabel.htmlFor = "loanBalance";
  nameLabel.textContent = "Loan Balance ($)";
  nameLabel.className = "inputLabel";
  balanceInput.dataset.cell = "balance";
  balanceInput.type = "number";
  balanceInput.min = "0";
  balanceInput.step = "0.01";
  balanceInput.id = "loanBalance";
  balanceInput.classList.add("loan-input", "digits");
  balanceInput.name = "loanBalance";
  divElement.appendChild(nameLabel);
  divElement.appendChild(balanceInput);
  modal.appendChild(divElement);

  let interestInput = document.createElement("input");
  nameLabel = document.createElement("label");
  divElement = document.createElement("div");
  nameLabel.htmlFor = "loanRate";
  nameLabel.textContent = "Interest APR(%)";
  nameLabel.className = "inputLabel";
  interestInput.dataset.cell = "interest rate";
  interestInput.type = "number";
  interestInput.id = "loanRate";
  interestInput.min = "0";
  interestInput.step = "0.01";
  interestInput.placeholder = "0.00%";
  interestInput.classList.add("loan-input", "digits");
  interestInput.name = "loanRate";
  divElement.appendChild(nameLabel);
  divElement.appendChild(interestInput);
  modal.appendChild(divElement);

  let minPaymentInput = document.createElement("input");
  nameLabel = document.createElement("label");
  divElement = document.createElement("div");
  nameLabel.htmlFor = "minPayment";
  nameLabel.textContent = "Minimum Monthly Payment ($)";
  nameLabel.className = "inputLabel";
  minPaymentInput.dataset.cell = "minimum payment";
  minPaymentInput.type = "number";
  minPaymentInput.id = "minPayment";
  minPaymentInput.min = "0";
  minPaymentInput.step = "0.01";
  minPaymentInput.placeholder = "$0.00";
  minPaymentInput.classList.add("loan-input", "digits");
  minPaymentInput.name = "loanMin";
  divElement.appendChild(nameLabel);
  divElement.appendChild(minPaymentInput);
  modal.appendChild(divElement);

  let menuName = "Payment Order";
  let OrderTypes = ["Interest-First Payments", "Principal-First Payments"];

  modal.appendChild(generateSelectMenu(menuName, OrderTypes));

  menuName = "Loan Type";
  let loanTypes = [
    "Federal Student Loan",
    "Private Student Loan",
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

    updateEntry(event, updatedDataObj);
  });
}

let checkListener = (event)=>{
  let target = event.target.closest('input[type=checkbox]');
  
  if(target && target.tagName === "INPUT"){
    let key = target.id.split('-').filter(i => i !== "cc").toString();
    columnMap.set(key, target.checked);
  }else{
    return;
  }
}

function generateColumnOptions() {
  let container = document.createElement("div");
  container.className = "cc-container";
  container.id = "column-configuration"

  let title = document.createElement('h3');
  title.textContent = "Shown Columns"
  container.appendChild(title);

  let applyButton = document.createElement("button");
  applyButton.textContent = "Apply";
  applyButton.className = "cc-apply";
  applyButton.id = "apply-columns"
  // applyButton.addEventListener('click', ()=>{
  // let fields = {
  //   loanName: "Loan Name",
  //   balance: "Balance",
  //   rate: "Interest Rate",
  //   minPayment: "Minimum Payment",
  //   order: "Payment Order",
  //   loanType: "Loan Type",
  // };
  //   let parent = document.getElementById('loan-list')
  //   let headerElement = parent.querySelector('thead');
  //   parent.replaceChild(headerElement, generateTableHeader(fields));
  //   loanList.forEach((item) =>{
  //     generateListItem()
  //   })

  // })

  let contentContainer = document.createElement("ul");
  contentContainer.className = "cc-content";

  let configOptions = [
    {label: "Loan Name", value: "loanName" },
    {label:"Loan Balance", value:"balance"},
    {label:"Interest Rate", value:"rate"},
    {label:"Minimum Payment", value:"minPayment"},
    {label:"Payment Order", value:"order"},
    {label:"Loan Type", value:"loanType"},
  ];

  configOptions.forEach(item =>{
    let liElement = document.createElement("li");
    liElement.className = "cc-option";

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = "cc-checkbox";
    checkbox.id = `cc-${item.value}`

    let customBox = document.createElement("span");
    customBox.className = "cc-checkmark"

    let label = document.createElement('label');
    label.htmlFor = `cc-${item.value}`
    label.className = "cc-label";

    label.appendChild(checkbox);
    label.appendChild(customBox);
    label.insertAdjacentText('beforeend', item.label)
    liElement.appendChild(label);
    contentContainer.appendChild(liElement);
  })

  contentContainer.addEventListener('click', checkListener);
  container.appendChild(contentContainer);
  container.appendChild(applyButton);

  return container;
}

function generateTableHeader(fields){
  let thead = document.createElement('thead');
  let trElement = document.createElement('tr');
  trElement.id = 'header';

  for(let [data, enabled] of columnMap){
    if(enabled){
      let thElement = document.createElement('th');
      thElement.textContent = fields[data];
      trElement.appendChild(thElement);
    }
  };
  thead.appendChild(trElement);
  return thead;
}

function listView() {
  const [listView, gridView] =
    elements.viewToggleContainer.querySelectorAll("button");
  elements.loanContainer.removeEventListener("click", listSelectDelegator);
  loanData.length === 0 ? (selectMode = false) : null;

  if (selectMode) {
    //display change was done while selectMode was on
    document.getElementById("multiselect-actions").remove(); //remove the old counter, since render function will be adding one.

    localStorage.setItem("viewMode", "list"); //Update viewMode in local storage
    elements.loanContainer.classList.replace("grid", "list"); //display change was made so repalce grid class for list class
    if (loanData.length > 0) {
      renderSelectableList(); //Finally render in select mode
      selectHandler();
    }
  } else {
    //Display change was made out of select mode
    listView.classList.remove("active-view");
    gridView.classList.remove("active-view"); //clear all viewmodes

    // elements.loanContainer.classList.replace("grid", "list");
    elements.loanContainer.className = ""; //clear all other classes, might have empty or grid toggled
    elements.loanContainer.className = "list"; //add the relevant class
    updateList();
    if (loanData.length > 0) {
      localStorage.setItem("viewMode", "list");
    }
  }
  listView.classList.add("active-view");
  gridView.classList.remove("active-view");
}

function generateListItem(dataObj, selectMode) {
  //Implement the configuration array, so columns can be generated based on user selections.
  //The array will be used such that: DataObject[String_From_Config]
  //Loop? What about the different data types? Deciamals? Split Strings? Hmmm...
  // let { id, loanName, balance, rate, minPayment, order } = dataObj;

  const trElement = document.createElement("tr"); //create a row container
  trElement.classList.add("loan");
  trElement.id = `group-${dataObj.id}`;
  let fields;
  // const fields = [
  //   loanName,
  //   `$${Number.parseFloat(balance).toFixed(2)}`,
  //   `${Number.parseFloat(rate).toFixed(2)}%`,
  //   `$${Number.parseFloat(minPayment).toFixed(2)}`,
  //   order
  //     .split(/[-\s]/)
  //     .filter((word) => word !== "Payments")
  //     .join(" "),
  // ];


    columnMap.forEach(
      (enabled, value)=>{
        if(enabled){
          const td = document.createElement("td"); //create a table data element
          td.innerText = dataObj[value];
          trElement.appendChild(td);
        }
      }
    )

  if (selectMode) {
    trElement.classList.add("selectable-row");
    let tdElement = document.createElement("td");
    let checkLabel = document.createElement("label");
    checkLabel.className = "checkbox-container";

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.className = "checkbox";
    inputElement.id = `check-${dataObj.id}`;

    let spanElement = document.createElement("span");
    spanElement.className = "checkmark";

    checkLabel.appendChild(inputElement);
    checkLabel.appendChild(spanElement);
    tdElement.appendChild(checkLabel);
    trElement.appendChild(tdElement);
    if (selectedItemsArray && selectedItemsArray.includes(`group-${dataObj.id}`)) {
      let checkbox = trElement.querySelector(".checkbox");
      checkbox.checked = !checkbox.checked;
      trElement.classList.toggle("selected", checkbox.checked);
    }
  } else {
    const tdDropdown = document.createElement("td"); //create dropdown container
    tdDropdown.appendChild(generateDropdown(dataObj.id)); //insert dropdown content
    trElement.appendChild(tdDropdown); //insert the completed dropdown to the row
  }

  return trElement;
  // return document.createElement('span')
}

function updateList() {
  elements.loanContainer.replaceChildren(); //start with an empty loan container

  if (loanData.length === 0) {
    showEmpty();
    return;
  }

  let fields = {
    loanName: "Loan Name",
    balance: "Balance",
    rate: "Interest Rate",
    minPayment: "Minimum Payment",
    order: "Payment Order",
    loanType: "Loan Type",
  };
  document.getElementById('column-configuration') 
    ? document.getElementById('column-configuration').remove() 
    : null;

  elements.tableToolbar.appendChild(generateColumnOptions());//This is a temporary spot, it need to be a popup menu.

  let applyButton = document.getElementById('apply-columns');
  applyButton.addEventListener('click', ()=>{
    let loanListContainer = document.getElementById('loan-list');
    loanListContainer.replaceChildren();
    loanListContainer.appendChild(generateTableHeader(fields));

    loanData.forEach(dataObj => {
      loanListContainer.appendChild(generateListItem(dataObj,false))});
  });

  initColumnConfig.forEach(({column, status})=>{
    document.getElementById(`cc-${column}`).checked = status
    key = column.split('-').filter((i)=> i !== "cc").toString();
    columnMap.set(key, status);
  });

  elements.loanContainer.className = "list";
  let table = document.createElement("table"); //the table where the items will display
  table.id = "loan-list";

  table.insertAdjacentElement("afterbegin", generateTableHeader(fields));

  //Populate the table with the list items
  loanData.forEach((dataObj) => {
    table.appendChild(generateListItem(dataObj, false)); //completed row is added to the table
  });

  table.addEventListener("click", clickDelegator);
  elements.loanContainer.appendChild(table); //completed table is added to the loan container
}

function gridView() {
  const [listView, gridView] =
    elements.viewToggleContainer.querySelectorAll("button");
  loanData.length === 0 ? (selectMode = false) : null;

  if (selectMode) {
    localStorage.setItem("viewMode", "grid");
    elements.loanContainer.classList.replace("list", "grid");
    renderSelectableGrid();
    selectHandler();
  } else {
    listView.classList.remove("active-view");
    gridView.classList.remove("active-view");

    elements.loanContainer.className = "grid";
    updateGrid();
    if (loanData.length > 0) {
      localStorage.setItem("viewMode", "grid");
    }
  }
  gridView.classList.add("active-view");
  listView.classList.remove("active-view");
}

function generateGridItem(dataObj, selectMode) {
  let { id, loanName, balance, rate, minPayment, order, loanType } = dataObj;

  let itemContainer = document.createElement("div");
  itemContainer.classList.add("loan");
  itemContainer.id = `group-${id}`;

  let title = document.createElement("div");
  title.className = "loan-title";

  let aElement = document.createElement("a");
  aElement.insertAdjacentHTML("afterbegin", svgArray.loanType[loanType]);

  let tooltip = document.createElement("span");
  tooltip.className = "tooltip";
  tooltip.textContent = loanType;

  aElement.appendChild(tooltip);
  title.appendChild(aElement);

  let name = document.createElement("span");
  name.className = "title-name";
  name.textContent = loanName;
  title.appendChild(name);

  selectMode
    ? itemContainer.classList.add("selectable")
    : title.appendChild(generateDropdown(id));

  itemContainer.appendChild(title); //Rebuld the rest of the loan Item, it will be glorious!

  const fields = [
    {
      svg: `
      <svg class="info-icon" width="30" height="30" class="info-icon" viewBox="0 0 42 60">
        <path d="M40.024 22.719c-2.412-9.615-11.75-13.231-12.567-14.112L29.753.248s-2.867-.927-6.89.8C17.75 3.244 14.9.444 14.9.444l2.525 8.295c-.793.9-10.725 4.938-12.524 14.44-.914 4.815.4 10.843 4.6 14.943 1.517-.584 3.407-.964 5.855-.964h10.03a4.22 4.22 0 0 1 4.217 4.217c0 .106-.014.21-.022.315 9.144-3.175 12.109-12.343 10.443-18.971m-12.358 8.117c-.23.498-.584.935-1.05 1.305-.475.372-1.083.672-1.808.888a8 8 0 0 1-1.165.237v1.386h-2.058V33.34a11.4 11.4 0 0 1-2.165-.308c-.789-.194-1.413-.434-1.91-.732-.118-.074-.13-.1-.13-.354v-1.772c0-.138.032-.138.074-.138a.25.25 0 0 1 .11.028q.257.135.533.269.662.314 1.351.542c.456.154.914.278 1.359.37.454.093.882.143 1.267.143.969 0 1.668-.189 2.14-.577.484-.398.727-.892.727-1.47q-.001-.437-.146-.793-.155-.377-.559-.689c-.243-.19-.584-.377-1.009-.555-.41-.172-.937-.357-1.567-.55-.833-.268-1.538-.554-2.095-.848-.544-.288-.981-.607-1.303-.945a3 3 0 0 1-.674-1.073 3.9 3.9 0 0 1-.207-1.287c0-.587.146-1.127.434-1.606a4.2 4.2 0 0 1 1.214-1.278 6.1 6.1 0 0 1 1.838-.846c.233-.064.476-.116.718-.16V17.35h2.058v1.242c.573.022 1.145.07 1.696.172a8.4 8.4 0 0 1 1.747.516c.106.044.131.07.131.17v1.835q-.002.039-.073.037a.3.3 0 0 1-.097-.015 16 16 0 0 0-1.545-.445 10 10 0 0 0-2.265-.27c-.909 0-1.612.178-2.093.528q-.771.566-.773 1.445.002.381.165.716c.11.223.293.437.55.633.237.183.55.365.96.55.389.18.89.364 1.484.545.796.246 1.49.51 2.065.784.562.267 1.03.568 1.392.894a2.9 2.9 0 0 1 .772 1.076c.169.41.253.892.253 1.436a3.9 3.9 0 0 1-.346 1.637"/>
        <path d="M18.489 43.882h6.897a2.507 2.507 0 1 0 0-5.015h-10.03c-6.272 0-8.257 2.613-10.452 4.806L.92 47.153a1.18 1.18 0 0 0-.406.893v11.56a.395.395 0 0 0 .654.298l7.696-6.597c.27-.231.633-.328.983-.266l11.993 2.18a3.17 3.17 0 0 0 2.393-.53s15.308-10.644 16.438-11.585c1.077-.989 1.066-2.423.075-3.501-.989-1.079-2.833-.85-4.065.062-1.128.94-8.831 6.002-8.831 6.002h-9.362l-.03.015a.896.896 0 0 1-.864-.923.896.896 0 0 1 .923-.862z"/>
      </svg>`,
      label: "Balance",
      value: `$${Number.parseFloat(balance).toFixed(2)}`,
    },
    {
      svg: `
      <svg width="25" height="25" viewBox="0 0 60 60" class="info-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 7.5H52.5C53.163 7.5 53.7989 7.76339 54.2678 8.23223C54.7366 8.70107 55 9.33696 55 10V50C55 50.663 54.7366 51.2989 54.2678 51.7678C53.7989 52.2366 53.163 52.5 52.5 52.5H7.5C6.83696 52.5 6.20107 52.2366 5.73223 51.7678C5.26339 51.2989 5 50.663 5 50V10C5 9.33696 5.26339 8.70107 5.73223 8.23223C6.20107 7.76339 6.83696 7.5 7.5 7.5ZM36.9825 24.4825L30.8575 30.6075L25.555 25.3025L14.9475 35.91L18.4825 39.445L25.555 32.375L30.8575 37.6775L40.5175 28.0175L45 32.5V20H32.5L36.9825 24.4825Z"/>
      </svg>`,
      label: "Interest",
      value: `${Number.parseFloat(rate).toFixed(2)}% APR`,
    },
    {
      svg: `
      <svg class="info-icon" width="25" height="25" class="info-icon" viewBox="0 0 52 60">
        <path d="M49.439 0c-1.301 0-3.213 1.733-3.989 2.483l-1.87 1.835c-.32.309-.744.479-1.206.479s-.888-.17-1.207-.478l-1.899-1.84C37.993 1.247 35.88 0 34.308 0c-1.574 0-3.687 1.247-4.962 2.479l-1.903 1.84c-.32.308-.751.478-1.215.478s-.895-.17-1.215-.479l-1.904-1.84C21.865 1.278 19.703 0 18.146 0s-3.72 1.277-4.963 2.479l-1.903 1.84c-.32.308-.752.478-1.216.478s-.896-.17-1.216-.479l-1.903-1.84C6.84 2.379 4.316 0 2.79 0 1.047 0 .384 2.361.384 4.384v51.232C.384 57.64 1.047 60 2.79 60c1.467 0 3.835-2.225 4.094-2.474l1.936-1.844c.32-.31.759-.48 1.226-.48s.902.17 1.223.481l1.908 1.838C14.421 58.723 16.584 60 18.143 60s3.721-1.277 4.965-2.479l1.904-1.84c.32-.308.752-.478 1.216-.478s.896.17 1.216.479l1.903 1.84C30.591 58.721 32.753 60 34.31 60c1.558 0 3.72-1.277 4.964-2.479l1.903-1.84c.32-.308.752-.478 1.216-.478s.895.17 1.215.479l1.904 1.84c.958.925 2.702 2.478 3.927 2.478 1.433 0 2.177-1.557 2.177-4.384V4.384C51.616 1.557 50.873 0 49.44 0m-9.055 45.069H27.78v-5.206h12.603zm0-12.603H11.89v-4.932h28.494zm0-12.329H11.89v-5.206h28.494z"/>
      </svg>`,
      label: "Minimum Monthly Payment",
      value: `$${Number.parseFloat(minPayment).toFixed(2)}/month`,
    },
  ];

  let ulElement = document.createElement("ul");
  ulElement.className = "info-container";

  fields.forEach((field) => {
    let liElement = document.createElement("li");
    liElement.className = "info-row";

    if (field.svg) {
      let aElement = document.createElement("a"); //add svg
      aElement.className = "info-svg";
      aElement.insertAdjacentHTML("afterbegin", field.svg);
      liElement.appendChild(aElement);

      let spanElement = document.createElement("span"); //add label
      spanElement.className = "label";
      spanElement.textContent = `${field.label}`;
      liElement.appendChild(spanElement);
    }

    let spanElement = document.createElement("span"); //add data value
    spanElement.className = "data";
    spanElement.textContent = field.value;

    liElement.appendChild(spanElement);

    ulElement.appendChild(liElement);
    itemContainer.appendChild(ulElement);
  });

  let liElement = document.createElement("li");
  liElement.className = "paymentOrder";
  liElement.textContent = order
    .split(/[-\s]/)
    .filter((word) => word !== "Payments")
    .join(" ");
  ulElement.appendChild(liElement);

  return itemContainer;
}

function updateGrid() {
  elements.loanContainer.replaceChildren();
  if (loanData.length === 0) {
    showEmpty();
    return;
  }

  document.getElementById('column-configuration') 
  ? document.getElementById('column-configuration').remove() 
  : null;
  elements.loanContainer.className = "grid";

  loanData.forEach((dataObj) => {
    elements.loanContainer.appendChild(generateGridItem(dataObj, false));
  });

  elements.loanContainer.addEventListener("click", clickDelegator);
}

function renderSelectableGrid() {
  selectMode = true;
  elements.loanContainer.replaceChildren();
  elements.loanContainer.removeEventListener("click", listSelectDelegator);
  elements.loanContainer.addEventListener("click", gridSelectDelegator);
  if (document.getElementById("multiselect-actions")) {
    document.getElementById("multiselect-actions").remove();
  }
  if (!selectedItemsArray) {
    selectedItemsArray = [];
  }

  loanData.forEach((dataObj) => {
    let item = generateGridItem(dataObj, true);
    if (selectedItemsArray && selectedItemsArray.includes(item.id)) {
      item.classList.add("selected");
    }
    elements.loanContainer.appendChild(item);
  });

  let ulElement = document.createElement("ul");
  ulElement.id = "multiselect-actions";

  let actions = [
    {
      label: allSelected ? "Unselect All" : "Select All",
      action: "all-multiselect",
    },
    { label: "Cancel", action: "exit-multiselect" },
    { label: "Delete", action: "delete-multiselect" },
  ];

  actions.forEach(({ label, action }) => {
    let liElement = document.createElement("li");
    let button = document.createElement("button");
    button.textContent = label;
    button.id = action;
    button.className = "actions";
    liElement.appendChild(button);
    ulElement.appendChild(liElement);
  });

  let liElement = document.createElement("li");
  let pElement = document.createElement("p");
  pElement.textContent = selectedItemsArray
    ? `${selectedItemsArray.length} selected`
    : `0 selected`;
  pElement.id = "select-count";
  liElement.appendChild(pElement);
  ulElement.appendChild(liElement);

  elements.tableToolbar.appendChild(ulElement);
}

function deleteSelections() {
  if (selectedItemsArray && selectedItemsArray.length > 0) {
    selectedItemsArray.forEach((item) => {
      let identifier = item
        .split("-")
        .filter((i) => i !== "group")
        .join();
      let dataArrIndex = loanData.findIndex((data) => data.id === identifier);

      loanData.splice(dataArrIndex, 1);
      document.getElementById(`group-${identifier}`).remove();
    });

    if (loanData.length === 0) {
      localStorage.setItem("viewMode", "empty");
    }

    selectedItemsArray = null;
    document.getElementById("select-count").remove();
    localStorage.setItem("LPMdata", JSON.stringify(loanData));
    selectMode = false;

    let viewMode = localStorage.getItem("viewMode");
    viewMode === "list" ? listView() : gridView();

    document.getElementById("multiselect-actions").remove();
    document.getElementById("multi-select").classList.remove("active-view");
  } else {
    let counter = document.getElementById("select-count");
    counter.classList.add("noneSelected");
    setTimeout(() => {
      counter.classList.remove("noneSelected");
    }, 800);
  }
}

function exitMultiselect() {
  let items = document.querySelectorAll(".selectable");
  items.forEach((item) => {
    item.remove();
  });
  let viewMode = localStorage.getItem("viewMode");
  selectedItemsArray = null;
  selectMode = false;
  allSelected = false;
  document.getElementById("multi-select").classList.remove("active-view");
  document.getElementById("multiselect-actions")
    ? document.getElementById("multiselect-actions").remove()
    : null;
  viewMode === "list" ? listView() : gridView();
}

function selectAll() {
  if (loanData.length === 0) return;

  let allCards = allSelected
    ? selectedItemsArray
    : document.querySelectorAll(".loan");

  if (!selectedItemsArray) selectedItemsArray = [];

  allSelected = !allSelected;

  let item;
  let text = document.getElementById("all-multiselect");

  localStorage.getItem("viewMode") === "list"
    ? (document.getElementById("select-all").checked = selectAll)
    : null;

  //If allSelected is true, 'allCards' stores html elements
  //if it's false 'allcards' stores IDs
  if (allSelected) {
    allCards.forEach((card) => {
      selectedItemsArray.includes(card.id)
        ? null
        : selectedItemsArray.push(card.id);
      if (localStorage.getItem("viewMode") == "list") {
        card.querySelector(".checkbox").checked = true;
      }
      card.classList.add("selected");
    });
    text.textContent = "Unselect All";
  } else {
    allCards.forEach((card) => {
      item = document.getElementById(`${card}`);
      if (localStorage.getItem("viewMode") === "list") {
        item.querySelector(".checkbox").checked = allSelected;
        document.getElementById("select-all").checked = allSelected;
      }
      item.classList.remove("selected");
    });
    text.textContent = "Select All";
  }

  if (!allSelected) {
    selectedItemsArray = [];
    allCards = [];
  }

  selectedItemsArray
    ? (document.getElementById(
        "select-count"
      ).textContent = `${selectedItemsArray.length} selected`)
    : (document.getElementById("select-count").textContent = `0 selected`);
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
  elements.loanContainer.replaceChildren(); //Clear current UI elements

  // Remove any existing event listeners
  elements.loanContainer.removeEventListener("click", gridSelectDelegator);
  selectMode = true;

  let loanListContainer = document.createElement("table"); //parent table element
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

  loanData.forEach((dataObj) =>
    loanListContainer.appendChild(generateListItem(dataObj, true))
  );
  if (!selectedItemsArray) {
    selectedItemsArray = [];
  }

  loanListContainer.addEventListener("click", listSelectDelegator);

  elements.loanContainer.appendChild(loanListContainer);

  let allBtn = document.getElementById("select-all");
  allSelected ? (allBtn.checked = true) : (allBtn.checked = false);
  allBtn.addEventListener("change", (event) => {
    event.stopPropagation();
    selectAll();
  });

  //If actions container is in the DOM already it will be removed and re-added for listener attachment purposes
  let existingActionsContainer = document.getElementById("multiselect-actions");
  existingActionsContainer ? existingActionsContainer.remove() : null;

  //after all items are accounted for, inject the tool actions
  let ulElement = document.createElement("ul");
  ulElement.id = "multiselect-actions";

  let actions = [
    {
      label: allSelected ? "Unselect All" : "Select All",
      action: "all-multiselect",
    },
    { label: "Cancel", action: "exit-multiselect" },
    { label: "Delete", action: "delete-multiselect" },
  ];

  actions.forEach(({ label, action }) => {
    let liElement = document.createElement("li");
    let button = document.createElement("button");
    button.textContent = label;
    button.id = action;
    button.className = "actions";
    liElement.appendChild(button);
    ulElement.appendChild(liElement);
  });

  let liElement = document.createElement("li");
  let pElement = document.createElement("p");
  pElement.textContent = selectedItemsArray
    ? `${selectedItemsArray.length} selected`
    : `0 selected`;
  pElement.id = "select-count";
  liElement.appendChild(pElement);
  ulElement.appendChild(liElement);

  elements.tableToolbar.appendChild(ulElement);
}

window.addEventListener("DOMContentLoaded", (e) => {
  updateLoanContainer();
  viewListeners();
  toolListeners();
  newEntryListener();
});
