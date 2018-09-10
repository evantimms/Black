const settingForm = document.querySelector('.setting-form');
const settingFormSubmit = document.querySelector('#submit');
const amount = document.querySelector('#amount');
const reset = document.querySelector('#reset');

window.onload = ()=>{
    //change form action
    settingForm.action = window.location.href.replace('/edit')
   
    //fetch user and budget data
    fetch(window.location.href.replace('/edit', ' '))
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
    })
    .then((budget)=>{
        populate(budget);
    })  
    .catch((e)=>console.log(e));

    //event listener for form submision
    settingFormSubmit.addEventListener('click', ()=>{
        fetch(window.location.href.replace('/edit', ''))
        .then((response)=>{
            if(response.ok){
                window.location.replace(window.location.href.replace('/edit', ''));
            }
        })
        .catch((e)=>console.log(e));
    });
}

function populate(budget){
    console.log(budget);
    amount.value = budget.remaining_amount;
    reset.value = new Date(budget.reset_date);
}