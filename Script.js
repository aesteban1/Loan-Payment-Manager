let dateForm = document.getElementById('dateForm');
// let userBudget 

let loans = []

const data = JSON.parse(localStorage.getItem('LPMdata')) || []

dateForm.addEventListener('submit', (e)=>{
  let date = document.getElementById('paymentDate').value

  data.forEach(element=>{
    if(element.daysElapsed === null){
      element.daysElapsed = date
    }
  })

  let userDate = new Date(date)
  let today = new Date(Date.now())
  let elapsedMS = today.getTime()-userDate.getTime()
  let elapsedTime = Math.round(elapsedMS/(1000*3600*24))-1
  
  e.preventDefault()
  date.value = ''
})

function updateDateField(El){
  let selectedDate = El.value
  let target = El.parentElement.id.split('-')[1]
  data.find(element => element.id === `group-${target}`).date = selectedDate
}

const daily_accrual = (rate, balance)=>{
  return (rate/100)*(1/365)*balance
}
  
// let budget = 400

function calculate_payments(loans){
  let budget = document.getElementById('user-budget').value
  
  for(let loan of loans){
    budget-=loan["min_payment"];
    if(budget < 0){
      console.log("insufficient funds to cover minimum payments.");
      break;
    }
    console.log(`budget: ${budget.toFixed(2)}`, `min-payment: ${loan["min_payment"].toFixed(2)}`)
  }
  console.log(`budget after min-payments: ${budget}`)
  
  if (budget > 0){
    while(budget>0){
      for(let loan of loans){
        loan["daily_accrual"] = daily_accrual(loan["rate"], loan["balance"])  
      }
  
      let sorted_loans = loans.sort((a, b)=> b["daily_accrual"]-a["daily_accrual"])
  
      let split_payments = false
      if(sorted_loans.length > 1 && 
        (sorted_loans[0]["daily_accrual"] - sorted_loans[1]["daily_accrual"]) / sorted_loans[0]["daily_accrual"] <= 0.05){
          split_payments = true
      }
  
      if(split_payments){
        let total_accrual = sorted_loans[0]["daily_accrual"] + sorted_loans[1]["daily_accrual"]
        let payment1 = (sorted_loans[0]["daily_accrual"]/total_accrual) * budget;
        let payment2 = (sorted_loans[1]["daily_accrual"]/total_accrual) * budget;
  
        console.log(`Make a $${payment1} payment towards: ${sorted_loans[0]["balance"]}`)
        console.log(`Make a $${payment2} payment towards: ${sorted_loans[1]["balance"]}`)


        sorted_loans[0]["balance"]-= payment1
        sorted_loans[0]["daily_accrual"] = daily_accrual(sorted_loans[0]["rate"], sorted_loans[0]["balance"])
        sorted_loans[1]["balance"]-= payment2
        sorted_loans[1]["daily_accrual"] = daily_accrual(sorted_loans[1]["rate"], sorted_loans[1]["balance"])
  
        budget -= (payment1 + payment2)
      }else{
        let extra_payment = Math.min(sorted_loans[0]["balance"], budget)
        if (sorted_loans[0]["balance"] <= extra_payment) {
          console.log(`make the final payment towards $${sorted_loans[0]["balance"]}`)
          budget -= sorted_loans[0]["balance"];
          sorted_loans[0]["balance"] = 0;
          sorted_loans[0].pop()
        } else {
          console.log(`make a $${extra_payment} payment towards the $${sorted_loans[0]["balance"]} blanace`)
          sorted_loans[0]["balance"] -= extra_payment;
          sorted_loans[0]["daily_accrual"] = daily_accrual(sorted_loans[0]["rate"], sorted_loans[0]["balance"])
          budget -= extra_payment;
        }
      }
    }
  }
  for(let loan of loans){
    console.log(`Loan Balance: ${loan["balance"].toFixed(2)} Daily Accrual: ${loan["daily_accrual"].toFixed(2)} `)
  }
  console.log(`Remaining Budget: ${budget.toFixed(2)}`)
}