//constants for showing data
const remaining = document.querySelector('#remaining');
const reset = document.querySelector('#reset');
const pieChartContainer = document.querySelector('#pieChartContainer');
const historyChartContainer = document.querySelector('#historyChartContainer');
const purchaseHistory = document.querySelector('.purchase-history');
const cycleSpendage = document.querySelector('.cycle-spendage');

window.onload = ()=>{
    //link for edit page
    document.querySelector('#edit-link').addEventListener('click', (e)=>{
        e.preventDefault();
        let curUrl = window.location.href;
        window.location.replace(curUrl + '/edit');
    });

    //getting current budget data
   fetch(window.location.href + '/get_budget')
   .then((response)=>{
        if(response.ok){
            return response.json();
        }
    })
    .then((budget)=>{
       populate(budget);
    })
    .catch((e)=>console.log(e));
}

function populate(budget){
    remaining.innerText = budget.remaining_amount;
    reset.innerText = new Date(budget.reset_date).toDateString();
}