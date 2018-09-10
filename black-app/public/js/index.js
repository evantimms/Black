// changes class to allow toggling of navbar in mobile mode and when 
//loaded as chrome extension
function parseNewPurchase(){
    //TODO: Implement error handling code

    let form = document.querySelector('.Purchase-Form');
    let userInput = {
        description: form.elements[0].value,
        amount: form.elements[1].value,
    };

    
    fetch(window.location.href, {
        method: 'PUT',
        body: JSON.stringify({userInput:userInput}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
    })
    .then((user)=>{
        console.log(user);
        loadData(user);
    })
    .catch((e)=> console.log(e));

}




// INITALIZATION FUNCTIONS
function loadPie(data){


    // Function for loading of the main pie chart
    let chart = new CanvasJS.Chart("pieChartContainer", {
        animationEnabled: true,
        data : [{
            type: "doughnut",
            startAngle: 270,
            indexLabelFontSize: 17,
            indexLabel: "{label}",
            toolTipContent: "<b>{label}:</b> ${y}",
            dataPoints: [
                { y: data.budget.remaining_amount, label: "Remaining Funds" },
                { y: data.budget.spent_amount, label: "Spent Funds" }
            ]
        }]
    });

    chart.render();
    //removing credit cus i dont care bout them
    document.querySelector('.canvasjs-chart-credit').remove();
}

function calcAverage(arr){
    
    // each array element contains an object w/ description
    if(!arr){
        let sums = [];
        arr.forEach((el)=>{
            sums.push(el.amount);
        });
        return sums.reduce((acc, curr)=> acc+curr)/sums.length;
    }
    return 0;
}

function getDataPoints(arr){
    let points = [];
    arr.forEach((el)=>{
        points.push({
            x : new Date(`${el.transaction_date}`),
            y : el.amount
        });
    });

    return points;
}

function loadHistoryChart(data){


    //Function for loading and displaying the history line chart
    let chart = new CanvasJS.Chart("historyChartContainer", {
        animationEnabled: true,  
        title:{
            text: "Purchase History"
        },
        axisY: {
            title: "Spent",
            valueFormatString: "#0 ,,.",
            suffix: "CAD",
            stripLines: [{
                value: calcAverage(data.budget.history),
                label: "Average"
            }]
        },
        data: [{
            yValueFormatString: "$####",
            xValueFormatString: "YYYY MM DD",
            type: "spline",
            dataPoints: getDataPoints(data.budget.history)
        }]
    });
    chart.render();
    //removing credit cus i dont care bout them
    document.querySelector('.canvasjs-chart-credit').remove();
}


function loadCurrentDate(){

    let days = {
        0:'Sunday',
        1:'Monday',
        2:'Tuesday',
        3:'Wedensday',
        4:'Thursday',
        5:'Friday',
        6:'Saturday'    }

    let months = {
        0:'January',
        1:'Febuary',
        2:'March',
        3:'April',
        4:'May',
        5:'June',
        6:'July',
        7:'August',
        8:'September',
        9:'October',         
        10:'November', 
        11:'December'     }


    let day = document.querySelector('.Date-Day'),
        month = document.querySelector('.Date-Month'),
        day_number = document.querySelector('.Date-Number'),
        year = document.querySelector('.Date-Year');

    currentDate = new Date();

    day.innerText = days[currentDate.getDay()];
    month.innerText = months[currentDate.getMonth()];
    day_number.innerText = currentDate.getDate();
    if(day_number.innerText === '1'){
        day_number.innerText += 'st'; 
    }else if(day_number.innerText === '2'){
        day_number.innerText +='nd';
    }else if(day_number.innerText === '3'){
        day_number.innerText +='rd';
    }else{
        day_number.innerText +='th';
    }
    year.innerText = currentDate.getFullYear();

}

function loadData(user){

    fetch(window.location.href + '/' + user.budget + '/get_budget')
    .then((response)=>{
        if(response.ok){
            return response.json();
        }else{
            console.log("ERROR IN RESPONSE: " + response.status);
        }
    })
    .then((budget)=>{
        // console.log(budget);
        //user should now contain full budget
        user.budget = budget;
        //Loading Username
        document.querySelector('#username')
        .innerText = user.username;

        //Loading Data
        loadCurrentDate();

        //Loading graphics
        loadPie(user);
        loadHistoryChart(user);

        //Loading Main Display
        document.querySelector('#Remaining')
        .innerText = user.budget.remaining_amount;
        document.querySelector('#Reset')
        .innerText = new Date(user.budget.reset_date).toDateString();
    })
    .catch((e)=>console.log(e));


}

function init(){
    //Initialization Function

    fetch(new Request(window.location.href + '/get'))
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
    })
    .then((user)=>{
        // Initalizing user data
        loadData(user);
        let addBtn = document.querySelector('#addBtn');

        //Adding event listeners
        document.querySelector('#amount').addEventListener('keypress', (e)=>{
            let key = e.which || e.keyCode;
            if(key === 13){
                document.querySelector('.Purchase-Popup').classList.remove("Show");
                parseNewPurchase();
            }
        });   
        document.querySelector('#addBtn').addEventListener('click', function(){
            document.querySelector('.Purchase-Popup').classList.toggle("Show");
        });
        document.querySelector('.Navbar-Toggle').addEventListener('click', function(){
            let nav = document.querySelector('.Navbar-Items');
            nav.classList.toggle('Navbar-ToggleShow');
        });
        document.querySelector('#new-budget').href = window.location.href + 
        '/' + user.budget + '/new'
        document.querySelector('#edit-budget').href = window.location.href + 
        '/' + user.budget + '/edit';
        document.querySelector('#budget-details').href = window.location.href + 
        '/' + user.budget;

    })
    .catch((e)=> console.log(e)); 
}

window.addEventListener('DOMContentLoaded', init);