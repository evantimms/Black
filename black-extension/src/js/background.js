//installation listener
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log('this is first install');
    }else if(details.reason == 'update'){
        let thisVersion = chrome.runtime.getManifest().version;
        if(details.previousVersion != thisVersion){
            console.log("Updated from " + details.previousVersion + " to " + thisVersion);
        }else{
            // console.log("Running version " + thisVersion);
        }
    
    }
});


//CONTEXT MENUS
chrome.contextMenus.create({
    "id": toString(Math.random()),
    "title": "Add To Ris",
    "contexts": ["selection", "page"],
});

chrome.contextMenus.onClicked.addListener(function(info, tabs){

    let value = info.selectionText;

    if(!isNaN(parseFloat(value))){
        //If value can be parsed to a float, aka is able to be added to budget
        chrome.tabs.getSelected(null, function(tab){
            sendData(value,tab.url)
        })
    }else {
        console.log("Input Cannot Be Parsed");
    }
});

//Function for sending user data to budget site/server
function sendData(value, host_url){
    let url = 'http://localhost:5000/user/73298dhabc712hd6';
    let currentDate = new Date();
    let userInput = {
        description: host_url,
        amount: value,
        transaction_dd: currentDate.getDate(),
        transaction_mm: currentDate.getMonth(),
        transaction_yyyy: currentDate.getFullYear()
    }
    fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInput)
    })
    .then((response)=>{
        if(response.ok){
            return response.json();
        }else{
            console.log(response.status);
        }
    })
    .then((data)=> console.log(data.message))
    .catch((e)=> console.log(e));
}