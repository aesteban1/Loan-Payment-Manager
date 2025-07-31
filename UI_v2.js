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

const svgArray = {
  loanType: {
    "Private Student Loan":
      '<svg class="iconType" width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 21h-3l1-3h1l1 3zm-12.976-4.543l8.976-4.575v6.118c-1.007 2.041-5.607 3-8.5 3-3.175 0-7.389-.994-8.5-3v-6.614l8.024 5.071zm11.976.543h-1v-7.26l-10.923 5.568-11.077-7 12-5.308 11 6.231v7.769z"/></svg>',
    "Federal Student Loan":
      '<svg class="iconType" width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M1 24h-1v-2h.998l.014-9h3.988v-3h2v3h2v-3h2v3h2v-3h2v3h2v-3h2v3h4v9h1v2h-23zm20-7h-18v5h2v-3c0-.552.448-1 1-1s1 .448 1 1v3h2v-3c0-.552.448-1 1-1s1 .448 1 1v3h2v-3c0-.552.448-1 1-1s1 .448 1 1v3h2v-3c0-.552.448-1 1-1s1 .448 1 1v3h2v-5zm-6-15h-3v1c2.966 0 6.158 1.979 7 6h-14c.547-3.78 3.638-5.827 6-6v-3h4v2z"/></svg>',
    "Credit Card":
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M0 8v-2c0-1.104.896-2 2-2h20c1.104 0 2 .896 2 2v2h-24zm24 3v7c0 1.104-.896 2-2 2h-20c-1.104 0-2-.896-2-2v-7h24zm-15 5h-6v1h6v-1zm3-2h-9v1h9v-1zm9 0h-3v1h3v-1z"/></svg>',
    "Car Loan":
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z"/></svg>',
    Mortgage:
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/></svg>',
    "Personal Loan":
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M19 7.001c0 3.865-3.134 7-7 7s-7-3.135-7-7c0-3.867 3.134-7.001 7-7.001s7 3.134 7 7.001zm-1.598 7.18c-1.506 1.137-3.374 1.82-5.402 1.82-2.03 0-3.899-.685-5.407-1.822-4.072 1.793-6.593 7.376-6.593 9.821h24c0-2.423-2.6-8.006-6.598-9.819z"/></svg>',
    "Buy Now Pay Later":
      '<svg class="iconType" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M11 6v8h7v-2h-5v-6h-2zm10.854 7.683l1.998.159c-.132.854-.351 1.676-.652 2.46l-1.8-.905c.2-.551.353-1.123.454-1.714zm-2.548 7.826l-1.413-1.443c-.486.356-1.006.668-1.555.933l.669 1.899c.821-.377 1.591-.844 2.299-1.389zm1.226-4.309c-.335.546-.719 1.057-1.149 1.528l1.404 1.433c.583-.627 1.099-1.316 1.539-2.058l-1.794-.903zm-20.532-5.2c0 6.627 5.375 12 12.004 12 1.081 0 2.124-.156 3.12-.424l-.665-1.894c-.787.2-1.607.318-2.455.318-5.516 0-10.003-4.486-10.003-10s4.487-10 10.003-10c2.235 0 4.293.744 5.959 1.989l-2.05 2.049 7.015 1.354-1.355-7.013-2.184 2.183c-2.036-1.598-4.595-2.562-7.385-2.562-6.629 0-12.004 5.373-12.004 12zm23.773-2.359h-2.076c.163.661.261 1.344.288 2.047l2.015.161c-.01-.755-.085-1.494-.227-2.208z"/></svg>',
    "Home Equity Loan": `<svg class="iconType" width="50" height="50" viewBox="0 0 55 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39.1756 2.17157C39.1756 1.61929 39.6233 1.17157 40.1756 1.17157H45.1756C45.7279 1.17157 46.1756 1.61929 46.1756 2.17157V15.1716L39.1756 8.17157V2.17157Z"/>
        <path d="M28.4363 38.5779C28.989 38.7378 29.4787 38.9068 29.9031 39.0887C30.5492 39.362 31.0376 39.6935 31.369 40.0828C31.7086 40.4722 31.8787 40.9525 31.8787 41.5242C31.8787 42.1374 31.692 42.6799 31.3191 43.1521C30.9463 43.6244 30.4205 43.9934 29.741 44.2586C29.3475 44.4141 28.9125 44.5224 28.4363 44.5867V38.5779Z"/>
        <path d="M26.3973 33.2459C26.2023 33.187 26.0115 33.1264 25.826 33.0603C25.3371 32.8781 24.9059 32.6668 24.533 32.4266C24.1602 32.178 23.8666 31.8834 23.6512 31.5437C23.444 31.204 23.3485 30.8061 23.365 30.3504C23.3651 29.8037 23.523 29.3153 23.8377 28.8846C24.1608 28.4537 24.6245 28.118 25.2293 27.8777C25.5741 27.736 25.9636 27.6349 26.3973 27.574V33.2459Z"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M25.7615 0.585736C26.5426 -0.195212 27.8086 -0.195279 28.5897 0.585736L53.7615 25.7576C55.0209 27.0176 54.1281 29.1717 52.3465 29.1717H47.1756V58.159C47.1755 58.7161 46.72 59.1659 46.1629 59.159L8.1629 58.6834C7.61553 58.6765 7.17559 58.2308 7.17559 57.6834V29.1717H2.00372C0.222072 29.1716 -0.669952 27.0175 0.589655 25.7576L25.7615 0.585736ZM26.3973 20.1717V23.0447C24.978 23.1484 23.6856 23.458 22.5203 23.9744C21.062 24.6207 19.9138 25.5199 19.077 26.6717C18.2484 27.8233 17.8383 29.1697 17.8465 30.7107C17.8382 32.5915 18.4553 34.0877 19.6981 35.198C20.941 36.3084 22.636 37.1243 24.782 37.6463L26.3973 38.0516V44.6004C25.8491 44.5353 25.3395 44.4139 24.869 44.2342C24.1398 43.9442 23.5552 43.5173 23.116 42.9539C22.6852 42.3823 22.4416 41.6695 22.3836 40.8162H17.1756C17.2171 42.6473 17.6605 44.1847 18.5057 45.4275C19.3591 46.6619 20.5442 47.5938 22.0604 48.2234C23.3239 48.7453 24.7695 49.0491 26.3973 49.1385V51.99H28.4363V49.1414C30.0799 49.0553 31.5132 48.7543 32.7361 48.2361C34.211 47.6064 35.3381 46.7238 36.117 45.5887C36.9041 44.4452 37.3021 43.0946 37.3104 41.5369C37.3021 40.4764 37.1075 39.5359 36.7264 38.7156C36.3535 37.8953 35.8267 37.1828 35.1473 36.5779C34.4678 35.9731 33.6641 35.4629 32.7361 35.0486C31.8082 34.6344 30.7887 34.303 29.6785 34.0545L28.4363 33.7566V27.5662C29.2763 27.6752 29.9725 27.9315 30.5242 28.3377C31.278 28.8928 31.705 29.6713 31.8045 30.6736H36.9627C36.9378 29.1574 36.5311 27.8234 35.7439 26.6717C34.9568 25.52 33.8551 24.6207 32.4383 23.9744C31.2697 23.4382 29.9357 23.1244 28.4363 23.033V20.1717H26.3973Z"/>
      </svg>`,
    "Medical Debt":
      '<svg class="iconType" width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M18.905 14c-2.029 2.401-4.862 5.005-7.905 8-5.893-5.8-11-10.134-11-14.371 0-6.154 8.114-7.587 11-2.676 2.865-4.875 11-3.499 11 2.676 0 .784-.175 1.572-.497 2.371h-6.278c-.253 0-.486.137-.61.358l-.813 1.45-2.27-4.437c-.112-.219-.331-.364-.576-.38-.246-.016-.482.097-.622.299l-1.88 2.71h-1.227c-.346-.598-.992-1-1.732-1-1.103 0-2 .896-2 2s.897 2 2 2c.74 0 1.386-.402 1.732-1h1.956c.228 0 .441-.111.573-.297l.989-1.406 2.256 4.559c.114.229.343.379.598.389.256.011.496-.118.629-.337l1.759-2.908h8.013v2h-5.095z"/></svg>',
    "Payday/Title Loan":
      '<svg class="iconType" width="50" height="50" viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg"><path d="M48.0633 6.925C41.7094 6.925 36.6117 12.0906 36.6117 18.4445C36.6117 24.7633 41.7422 29.8937 48.0633 29.8937C54.382 29.8937 59.5477 24.7633 59.5477 18.4094C59.5477 12.0555 54.4172 6.925 48.0633 6.925ZM48.9234 24.6742V26.4742H47.3391V24.7305C45.968 24.7305 44.5852 24.3672 43.9172 23.9945L44.4961 21.6719C45.232 22.0352 46.3875 22.4641 47.6109 22.4641C48.9234 22.4641 49.5703 21.8875 49.5703 21.0953C49.5703 20.3008 48.9469 19.9727 47.4281 19.3844C45.3234 18.6484 44.0086 17.5844 44.0086 15.693C44.0086 13.9469 45.1641 12.5781 47.2828 12.1469V10.2555H48.8672V12.0555C50.182 12.0555 51.1336 12.3273 51.8344 12.7023L51.1898 14.9664C50.6672 14.7531 49.8187 14.3898 48.6516 14.3898C47.4844 14.3898 46.8516 14.9664 46.8516 15.5453C46.8516 16.3375 47.5875 16.6445 49.1742 17.2891C51.3352 18.0813 52.3453 19.1805 52.3453 20.9805C52.3453 22.7828 51.2461 24.1516 48.9234 24.6742ZM44.7656 32.3125H33.75V22.4688C33.75 17.6734 29.5594 13.7969 24.8437 13.7969H10.0781C4.90078 13.7969 0.466402 18.2828 0.468746 22.7031V40.75C0.461714 42.7492 1.875 43.7945 3.28125 43.7969C4.68984 43.7992 6.09375 42.7539 6.09375 40.75V23.1719H7.96875V43.7969H26.25V23.1719H28.125L28.1437 34.9773C28.132 37.0234 29.3953 37.8953 30.7031 37.9375H44.7656C48.6 37.9375 48.6 32.3125 44.7656 32.3125ZM17.3484 0.203125C13.9664 0.203125 11.2781 2.9125 11.2781 6.27344C11.2781 9.63437 13.9875 12.3461 17.3484 12.3461C20.6883 12.3461 23.3977 9.65547 23.4211 6.27344C23.4211 2.9125 20.7094 0.203125 17.3484 0.203125Z"/></svg>',
  },
};

const fieldArray = {
  "Loan Balance": "",
};

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
    updateListItem(
      document.getElementById(`group-${identifier}`),
      updatedDataObj
    );
  });
}

function listView() {
  const [listView, gridView] =
    elements.viewToggleContainer.querySelectorAll("button");

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

    // elements.loanContainer.classList.replace("grid", "list");
    elements.className = ""; //clear all other classes, might have empty or grid toggled
    elements.className = "list"; //add the relevant class
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
  const [listView, gridView] =
    elements.viewToggleContainer.querySelectorAll("button");

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

  let title = document.createElement("div");
  title.className = "loan-title";

  let aElement = document.createElement("a");
  aElement.insertAdjacentHTML("afterbegin", svgArray.loanType[loanType]);
  title.appendChild(aElement);

  let name = document.createElement("span");
  name.className = "title-name";
  name.textContent = loanName;
  title.appendChild(name);

  title.appendChild(generateDropdown(id));

  itemContainer.appendChild(title); //Rebuld the rest of the loan Item, it will be glorious!

  let fields = [
    {
      svg: `
      <svg width="30" height="30" viewBox="0 0 42 60" class="info-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M40.0238 22.7187C37.6123 13.1038 28.2738 9.4875 27.4573 8.60672L29.7534 0.247968C29.7534 0.247968 26.886 -0.678516 22.8632 1.04812C17.749 3.24351 14.8999 0.443905 14.8999 0.443905L17.425 8.73855C16.6321 9.63949 6.70043 13.677 4.90055 23.1783C3.98684 27.994 5.30156 34.0218 9.50016 38.1216C11.0181 37.5375 12.9077 37.1584 15.3559 37.1584H25.3864C27.7119 37.1584 29.6033 39.0499 29.6033 41.3753C29.6033 41.4814 29.5887 41.5859 29.5813 41.6903C38.7255 38.5152 41.69 29.3471 40.0238 22.7187ZM27.666 30.8358C27.4352 31.3338 27.0819 31.7714 26.6168 32.1414C26.1407 32.5131 25.5328 32.8133 24.8077 33.0294C24.4525 33.132 24.0625 33.2126 23.643 33.2657V34.6518H21.5849V33.3407C20.8323 33.3022 20.1054 33.2033 19.4205 33.033C18.6314 32.839 18.0069 32.5991 17.5107 32.3006C17.3917 32.2274 17.3808 32.2017 17.3808 31.9472V30.1747C17.3808 30.0374 17.412 30.0374 17.454 30.0374C17.4907 30.0374 17.5328 30.0484 17.5639 30.0648C17.7342 30.1546 17.9136 30.2442 18.0968 30.334C18.5362 30.5427 18.9904 30.724 19.4481 30.876C19.9041 31.0298 20.3618 31.1543 20.8068 31.2458C21.2609 31.3392 21.6893 31.3887 22.0739 31.3887C23.0426 31.3887 23.742 31.2001 24.2145 30.8119C24.6979 30.4145 24.9414 29.9202 24.9414 29.3415C24.9414 29.0522 24.8919 28.7849 24.7949 28.5486C24.6923 28.2977 24.5055 28.0671 24.2364 27.8602C23.9929 27.6697 23.6523 27.4829 23.2275 27.3054C22.8173 27.1332 22.29 26.9483 21.6601 26.7543C20.827 26.487 20.122 26.2012 19.5654 25.9065C19.0215 25.6191 18.5839 25.3004 18.2617 24.9616C17.9486 24.632 17.7233 24.2713 17.5879 23.8887C17.4505 23.4987 17.3809 23.0647 17.3809 22.6015C17.3809 22.0155 17.5274 21.4754 17.8148 20.9957C18.1078 20.5031 18.518 20.0747 19.0288 19.7176C19.5451 19.3569 20.1659 19.0712 20.8672 18.8716C21.0997 18.8075 21.3434 18.7563 21.585 18.7124V17.3501H23.6432V18.5916C24.2163 18.6136 24.7876 18.6629 25.3387 18.7637C25.9357 18.8699 26.5234 19.0457 27.0855 19.28C27.1917 19.324 27.2174 19.3496 27.2174 19.4503V21.285C27.2155 21.3124 27.1917 21.3217 27.1441 21.3217C27.1021 21.3217 27.0673 21.3143 27.0471 21.307C26.5491 21.1368 26.029 20.9848 25.5016 20.8621C24.738 20.6844 23.9746 20.5929 23.2366 20.5929C22.3284 20.5929 21.6253 20.7705 21.1438 21.1202C20.6311 21.4956 20.3711 21.9809 20.3711 22.5649C20.3711 22.8176 20.4278 23.0593 20.5358 23.2808C20.6457 23.5042 20.8288 23.7184 21.0852 23.9143C21.3232 24.0975 21.6363 24.2787 22.0465 24.4637C22.4347 24.6431 22.9364 24.828 23.5296 25.0093C24.3261 25.2547 25.0201 25.5184 25.595 25.7931C26.1572 26.0604 26.6259 26.3607 26.9866 26.6866C27.3382 26.9998 27.5964 27.3623 27.7594 27.7634C27.9279 28.1735 28.012 28.655 28.012 29.1989C28.012 29.7866 27.8948 30.3359 27.666 30.8358Z"/>
        <path d="M18.4887 43.882C20.1622 43.882 25.3862 43.882 25.3862 43.882C26.7723 43.882 27.8947 42.7596 27.8947 41.3753C27.8947 39.9892 26.7723 38.8668 25.3862 38.8668C24.132 38.8668 21.6252 38.8668 15.3557 38.8668C9.08426 38.8668 7.09945 41.4797 4.90395 43.6733L0.921447 47.1524C0.663283 47.3776 0.514923 47.7018 0.514923 48.0459V59.6054C0.514923 59.7593 0.604689 59.9003 0.745665 59.9644C0.886642 60.0285 1.05141 60.0064 1.1686 59.9039L8.86453 53.3066C9.13559 53.0759 9.49805 52.9788 9.84785 53.0411L21.8413 55.2218C22.6781 55.3738 23.5386 55.1815 24.2345 54.6908C24.2345 54.6908 39.5421 44.0469 40.6719 43.1058C41.7486 42.117 41.7376 40.6833 40.747 39.6048C39.7582 38.5263 37.9144 38.7552 36.682 39.667C35.5541 40.6064 27.8509 45.6693 27.8509 45.6693H18.4887L18.4594 45.6839C17.9668 45.6674 17.5805 45.2536 17.5951 44.7611C17.6134 44.2685 18.0273 43.8821 18.518 43.8987L18.4887 43.882Z"/>
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
      <svg width="25" height="25" viewBox="0 0 52 60" class="info-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M49.4386 9.53674e-07C48.1375 9.53674e-07 46.226 1.73343 45.4504 2.48301L43.5797 4.31781C43.26 4.62685 42.8359 4.79699 42.3745 4.79699C41.9129 4.79699 41.486 4.62685 41.1671 4.3189L39.2682 2.47863C37.9931 1.24712 35.8805 9.53674e-07 34.3077 9.53674e-07C32.7342 9.53674e-07 30.6208 1.24712 29.346 2.47891L27.443 4.31808C27.1233 4.62712 26.6918 4.79726 26.2279 4.79726C25.7641 4.79726 25.3326 4.62712 25.0129 4.31808L23.1093 2.47891C21.8655 1.27699 19.7033 9.53674e-07 18.146 9.53674e-07C16.5888 9.53674e-07 14.4266 1.27699 13.1827 2.47891L11.2797 4.31808C10.9597 4.62712 10.5282 4.79726 10.0641 4.79726C9.60027 4.79726 9.16849 4.62712 8.84849 4.31808L6.94521 2.47891C6.84 2.37781 4.31644 9.53674e-07 2.78959 9.53674e-07C1.04712 9.53674e-07 0.383562 2.36137 0.383562 4.38356V55.6164C0.383562 57.6386 1.04712 60 2.78959 60C4.25726 60 6.6252 57.7748 6.88356 57.5255L8.82027 55.6819C9.14 55.3729 9.5789 55.2027 10.0458 55.2027C10.5123 55.2027 10.9485 55.3729 11.2693 55.683L13.1773 57.5211C14.4208 58.7227 16.5844 60 18.1433 60C19.7016 60 21.8644 58.7227 23.1077 57.5214L25.0123 55.6819C25.3321 55.3729 25.7638 55.2027 26.2279 55.2027C26.6921 55.2027 27.1238 55.3729 27.4438 55.6819L29.3471 57.5211C30.5907 58.7227 32.7529 60 34.3104 60C35.8679 60 38.0301 58.7227 39.2737 57.5211L41.1773 55.6819C41.497 55.3729 41.9285 55.2027 42.3929 55.2027C42.8567 55.2027 43.2885 55.3729 43.6082 55.6819L45.5118 57.5211C46.4699 58.4468 48.2142 60 49.4386 60C50.8723 60 51.6164 58.443 51.6164 55.6164V4.38356C51.6164 1.55699 50.8726 9.53674e-07 49.4386 9.53674e-07ZM40.3836 45.0685H27.7808V39.863H40.3836V45.0685ZM40.3836 32.4658H11.8904V27.5342H40.3836V32.4658ZM40.3836 20.137H11.8904V14.9315H40.3836V20.137Z"/>
      </svg>`,
      label: "Minimum Monthly Payment",
      value: `$${Number.parseFloat(minPayment).toFixed(2)}/month`,
    },
    {label:"PaymentOrder",value: order.split(/[-\s]/).filter(word => word !== "Payments").join(' ') },
    {value: loanType },
  ];
  //The loan Type icon might need a tooltip
  //Each data field will go in a parent container with svg, label, and data value
  //fields array needs the svgs that go with the labels

  let ulElement = document.createElement("ul");//Might need to remake the fields array to make building this card easier, how will you add the payment order without a reference to the min payment row?
  ulElement.className = "info-container";

  fields.forEach((field) => {
    let liElement = document.createElement("li");
    liElement.className = "info-row";

    if(field.svg){
      let aElement = document.createElement("a");
      aElement.className = "info-svg";
      aElement.insertAdjacentHTML("afterbegin", field.svg);      
      liElement.appendChild(aElement);

      let spanElement = document.createElement("span");
      let strongElement = document.createElement("strong");
      strongElement.textContent = `${field.label}`;
      spanElement.appendChild(strongElement);
      liElement.appendChild(spanElement);

    }else if(!field.svg && field.label){
      let spanElement = document.createElement("span");
      spanElement.className = `${fields.label}`;
      spanElement.textContent = field.value;
    }

    let pElement = document.createElement("p");
    pElement.textContent = field.value;

    liElement.appendChild(pElement);

    ulElement.appendChild(liElement);
    itemContainer.appendChild(ulElement);
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
    }
  );

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
    { id: "all-multiselect", content: "Select All", listener: selectAll },
    { id: "exit-multiselect", content: "Cancel", listener: exitMultiselect },
    {
      id: "delete-multiselect",
      content: "Delete",
      listener: deleteMultiselect,
    },
    {
      id: "selected-count",
      content: `${selectedItemsArray ? selectedItemsArray.length : 0} selected`,
    },
  ];

  listItems.forEach((item) => {
    const liELement = document.createElement("li");

    if (item.listener) {
      let btnElement = document.createElement("button");
      btnElement.id = item.id;
      btnElement.textContent = item.content;
      liELement.appendChild(btnElement);
    } else {
      const spanElement = document.createElement("span");
      spanElement.id = item.id;
      spanElement.textContent = item.content;
      liELement.appendChild(spanElement);
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
