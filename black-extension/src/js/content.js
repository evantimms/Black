


// Getting selection text
function getSelectionText(){
    let text = "";
    if(window.getSelectionText){
        text = window.getSelection().toString();
    }else if(document.selection && document.slection.type != "Control"){
        text = document.selection.createRange().text;
    }
}

// document.addEventListener()