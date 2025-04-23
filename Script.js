let dateForm = document.getElementById('dateForm');

let loans = []
let graphData = []
let budget;
const data = JSON.parse(localStorage.getItem('LPMdata')) || []


//Helper Functions
function setBudget(){
  budget = document.getElementById("user-budget").value
}

//unique date inputs
function updateDateField(El){
  let selectedDate = El.value
  let target = El.parentElement.id.split('-')[1]
  data.find(element => element.id === `group-${target}`).date = selectedDate
}

function daily_accrual(rate, balance){
  return (rate/100)*(1/365)*balance
}

function rangeInDays(date1, date2){
  let elapsedMS = date2.getTime()-date1.getTime()
  return Math.round(elapsedMS/(1000*3600*24))-1
}

function rangeInWeeks(date1, date2){

}

function rangeInMonths(date1, date2){

}

///draw Chart function
const chart = ()=> {
  const width = 800;
  const height = 500;
  const marginTop = 50;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  const y = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.balance)])
        .range([height - marginBottom, marginTop])

  const x = d3.scaleLinear()
        .domain([0,36])
        .range([marginLeft, width - marginRight])

  let svg = d3.select("#graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(x).ticks(36));

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height/50))
}


//create data objects for the chart input
function calculateTimeline(data, range=1){
  
  let d = data[0]

  let p = new Date(Date.now())
  let f = new Date(Date.now())
  f.setFullYear(f.getFullYear()+range)

  for(let i=0; i< 26;i++){
    console.log(new Date(f.setDate(f.getDate()+1)))
    if(rangeInDays(p, f)){}
  }
  
}

//calculate daily accrual and payments

//shared date input
dateForm.addEventListener('submit', (e)=>{
  e.preventDefault()

  let date = document.getElementById('paymentDate').value
  let userDate = new Date(date)
  let today = new Date(Date.now())
  let elapsedTime = rangeInDays(userDate, today)
  data.forEach(element=>{
    if(element.daysElapsed === null){
      element.daysElapsed = elapsedTime
    }
  })
  
  date.value = ''
})

// chart()
calculateTimeline(data)