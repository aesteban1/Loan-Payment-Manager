import { toDisplayDate, toInputDate } from "../utils/dateUtils.js";


let dateForm = document.getElementById('dateForm');

let loans = []
let graphData = []
let budget;
const data = JSON.parse(localStorage.getItem('LPMdata')) || []

let dataObj = data[0]

function dailyAccrual(apr, balance){
  return (balance * (apr/365))/100
}

function calculate(dataObj){
  const name = dataObj.loanName;
  const balance = Number.parseFloat(dataObj.balance.replace(/[^\d.-]/g, ""));
  const rate = Number.parseFloat(dataObj.rate.replace(/[^\d.-]/g, ""));
  const min = Number.parseFloat(dataObj.minPayment.replace(/[^\d.-]/g, ""));
  const order = dataObj.order;
  const type = dataObj.loanType;
  const lastPayment = dataObj.lastPayment;
}

function timeFrame(){
 const timeFrames = document.getElementById("time-frames");

 //The array of points needs to be generated based on the users time frame interval choice (weekly, bi-weekly, monthly, or bi-monthly payments).
 //We will use a time frames DOM element to let the user choose an option and then call this function to read the choice and build the array
}

function graph(array, width, height){
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 20;


}