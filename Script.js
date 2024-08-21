let loans = [
  {"balance": 4201.44, "rate": 4.53, "min_payment": 43.84},
  {"balance": 3494.74, "rate": 4.53, "min_payment": 36.46},
  {"balance": 3485.45, "rate": 2.75, "min_payment": 33.47},
  {"balance": 2100.68, "rate": 4.53, "min_payment": 21.92},
  {"balance": 2033.61, "rate": 2.75, "min_payment": 19.53},
  {"balance": 1571.48, "rate": 5.5, "min_payment": 29.98},
  {"balance": 1498.75, "rate": 4.99, "min_payment": 15.97}
]

const daily_accrual = (rate, balance)=>{
  return (rate/100)*(1/365)*balance
}

let budget = 400

function calcualte_payments(loans, budget){
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

calcualte_payments(loans, budget)