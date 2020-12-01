//JSON data that gets all the products when the page loads
let productsOnPage = [];
let productsMPO = [];
let productsCompare = [];
let allPriceAlerts = [];
let lists = [];

//All the counters that are counting products
let mpoCounter = 0;
let compareCounter = 0;
let listCounter = 0;

addCheckbox();
function addCheckbox(){
//Grab all the list items on a pricewatch page
let pricewatchItems = document.querySelector('.listing.useVisitedState').querySelectorAll('.largethumb');

//Add the checkbox the to all the products in the list on a pricewatch page
for(i=0; i < pricewatchItems.length; i++){
    let id = pricewatchItems[i].querySelector('input').getAttribute('value');
    let title = pricewatchItems[i].querySelector('.itemname').querySelector('.ellipsis').querySelector('a').innerText;
    let specline = pricewatchItems[i].querySelector('.itemname').querySelector('.specline.ellipsis').querySelector('a').innerText;
    let price = pricewatchItems[i].querySelector('.price').querySelector('a').innerText;
    let imageUrl = pricewatchItems[i].querySelector('.pwimage').querySelector('a').querySelector('img').getAttribute('src');
    
    //Set the HTML for the checkbox
    let checkBoxhtml = `<input type="checkbox" name="products[] value="${id}"">
    <span>Mijn Producten</span>`;
    
    //Create a new label and set the innerHTML to the checkbox HTML
    let label = document.createElement('label');
    label.className = 'mpo checkbox unselected';
    label.innerHTML = checkBoxhtml;
    let itemName = pricewatchItems[i].querySelector('.itemname');
    itemName.appendChild(label);
        
    //Push the data to a JSON file
        productsOnPage.push({
            id: id,
            title: title,
            specline: specline,
            price: price,
            imageUrl: imageUrl,
            priceAlert: false,
            alertPrice: 0,
            selected: false,
            label: label,
        });

        //Add an eventlistener to the label button for adding and deleting products to the quickaction menu
        label.addEventListener('click', () => {
            if(label.className === 'mpo checkbox unselected'){
                addToMPO(id, label);
            }else{
                deleteFromMPO(id, label); 
            }
        })
    }
}

//HTML for the new popover element
let html = `
<div class="wrapper">
<div class="tabbar">
<button style="float: left; border-top-left-radius: 2px;" class="button-tab mpo-tab"><span>Mijn Producten(<span class="counter1">${mpoCounter}</span>)</span></button>
<button style="float: right; border-top-right-radius: 2px" class="button-tab compare-tab"><span>Vergelijk<span>(0)</span</span></button>
</div>
<div class="contentWrapper">
<div class="topInfo">
<span class="topTitle">Mijn Producten(<span class="counter2">${mpoCounter}</span>)</span>
<a class="ctaButton newList">Nieuwe lijst maken</a>
</div>
<span class="introText">Je hebt nog geen producten toegevoegd. Producten die je toevoegd of een prijsalerts voor instelt kun je hier terugvinden. Ook kun je lijsten maken om je producten in te verdelen.</span>
<div class="singleProducts">
</div>
<div style="margin-top: 40px;" class="priceAlertsList">
<span class="list-title">Mijn Prijsalerts</span>
<div class="priceAlertContent">
<span class="alertAnnounce">Je hebt nog geen Prijsalerts ingesteld</span>
</div>
</div>
<div class="all-lists">
</div>
<div class="bottom-info">
<p style="margin-bottom: 5px; font-size: 12px;"><a href="#"><span>${listCounter}</span> lijsten, met in totaal <span class="counter3">${mpoCounter}</span> producten</a></p>
<p style="margin-bottom: 15px; font-size: 18px; font-weight: bolder;">Meer producten toevoegen?</p>
<a class="ctaButton">Bekijk Pricewatch</a>
</div>
</div>
</div>
`
//Create a new popover and set the styling and innerHTML
let popover = document.createElement('div');
popover.className = 'pop-over';
popover.innerHTML = html;

let newListButton = popover.querySelector('.newList');
newListButton.addEventListener('click', () => {
    createNewList();
})

//Append the new popover to the body
let body = document.querySelector('body');
body.appendChild(popover);

//Style the wrapper for the content
let contentWrapper = popover.querySelector('.contentWrapper');
let singleProducts = contentWrapper.querySelector('.singleProducts');















//Run the function suggestion items once
appendSuggestions();
function appendSuggestions(){
    //Create a wrapper for all the suggestion items and give it a classname
    let suggestionItemWrapper = document.createElement('div');
    suggestionItemWrapper.className = 'suggestion-item-wrapper';

    //Add the wrapper to the contentview
    contentWrapper.appendChild(suggestionItemWrapper);

    //Add a 4 suggestion items to the wrapper
    for(i = 0; i < 4; i++){

        //Calculate a random number
        let randomNumber = Math.floor((Math.random() * 25) + 1);

        //Create a div for the suggestion item
        let suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';

        //HTML for the suggestion item
        let suggestionItemHTML = `
        <div class="suggestion-item-content">
        <button class="addItem"></button>
        <div class="suggestion-item-info" style="tex-align: left; background-color: white; margin-left: 5px; height: auto;">
        <p style="max-width: 115px; height: 14px; word-wrap: break-word; overflow: hidden; margin-top: 87px; margin-bottom: 5px; font-size: 14px; color: #1668AC">${productsOnPage[randomNumber].title}</p>
        <p style="max-width: 100px; height: 14px; word-wrap: break-word; overflow: hidden; color: #666666;">${productsOnPage[randomNumber].specline}</p>
        </div>
        </div>
        `;
        //Set the HTML as innerHTML
        suggestionItem.innerHTML = suggestionItemHTML;

        //Set a background image for the item
        suggestionItem.style.backgroundImage = `url("${productsOnPage[randomNumber].imageUrl}")`;
        suggestionItemWrapper.appendChild(suggestionItem);

        //Eventlistener for the add button in the item
        let addButton = suggestionItem.querySelector('.addItem');
        addButton.addEventListener('click', () => {
            if(addButton.className === 'addItem'){
                addButton.classList.add('active');
            }else{
                addButton.classList.remove('active');
            }
        })
    }
}














//Function for adding products to the content listview
function addToMPO(productID, label){
    //Select the product that needs to be added
    let productToAdd = productsOnPage.filter(item => item.id === productID);
    productsMPO.push(productToAdd[0]);
    MPOProducts();

    //Change the class of the checkbox
    label.classList.remove('unselected');
    label.classList.add('selected');

    mpoCounter++;
    updateCounter();
}










function MPOProducts(){
    singleProducts.innerHTML = '';

    //Append all the items in the array to the view
    for(i = 0; i < productsMPO.length; i++){
     //Define the properties of the item
    let id = productsMPO[i].id;
    let label = productsMPO[i].label;
     //Create new item element
    let productItem = document.createElement('div');

    //Set the attribute id to the productID and style the element
    productItem.setAttribute('id', id);
    productItem.className = 'productItem';

      //HTML for the list item and add the properties
      let itemHTML = `
      <div class='itemWrapper'>
      <span class="closeButton product"></span>
      <div class='option setAlert' style="margin-top: 43px; margin-right: -20px; float: right;"></div>
      <div class='option addList' style="margin-top: 43px; margin-right: 5px; float: right;"></div>
      <div class="imageProduct" style='background-image: url("${productsMPO[i].imageUrl}");'></div>
      <div class='itemInfo'>
      <ul>
      <li class='titleProduct'><span><a>${productsMPO[i].title}</a></span></li>
      <li class='speclineProduct'><span><a style="color: #666666;">${productsMPO[i].specline}</a></span></li>
      <li  class='priceProduct'><span><a>${productsMPO[i].price}</a></span></li>
      </ul>
      </div>
      <label style="float: right;" class="compare ctaButton unselected checkbox"><input type="checkbox" name="products[]" value="${productsMPO[i].id}"><span>vergelijk</span></label>
      </div>
      `;

      //Set the innerHTML for the item to the itemHTML and append it to the contentview
      productItem.innerHTML = itemHTML;
      singleProducts.appendChild(productItem);

      //Add eventlistener to the delete button
      let deletebtn = productItem.querySelector('.closeButton');
      deletebtn.addEventListener('click', () => {
          deleteFromMPO(id, label);
      })

      //Event listener for setting a price alert for the product
      let priceAlert = productItem.querySelector('.setAlert');
      priceAlert.addEventListener('click', () =>{
          if(priceAlert.className == 'option setAlert'){
              setPriceAlert(id, priceAlert);
          }else{
              deletePriceAlert(id)
          }
      })

      //Event listener for adding the product to a list
      let addList = productItem.querySelector('.addList');
      addList.addEventListener('click', () => {
          if(addList.className === 'option addList'){
          addToList(id);
          addList.classList.add('active');
          }else{
              addList.classList.remove('active');
          }
      })

      if(productsMPO[i].priceAlert === true){
          priceAlert.classList.add('active');
      }else{
          //nothing
      }
}
}
















//Function that removes the product with the right ID from the content listview div
function deleteFromMPO(productID, label){
label.classList.remove('selected');
label.classList.add('unselected');
    let productToRemove = productsMPO.filter(item => item.id === productID);
    let index = productsMPO.indexOf(productToRemove[0])
    productsMPO.splice(index, 1)
    MPOProducts();
}















function setPriceAlert(productID, alert){
    let product = productsMPO.filter(item => item.id === productID);
    let notification = createNotification('prijsalert', productID);
    //If the users submits, the price alert will be set
    let submitButton = notification.querySelector('.ctaButton');
    submitButton.addEventListener('click', () =>{
        product[0].priceAlert = true;
        let value = notification.querySelector('input').value;
        product[0].alertPrice = value;
        allPriceAlerts.push(product[0]);
        alert.classList.add('active');
        calcPriceAlerts();
        notification.style.display = 'none';
    })
}















function deletePriceAlert(productID){
try{
    let alert = Array.from(singleProducts.querySelectorAll('.productItem')).filter(item => item.getAttribute('id') === productID);
    alert = alert[0].querySelector('.setAlert');
    alert.classList.remove('active');
    let product = productsMPO.filter(item => item.id === productID)
    product[0].priceAlert = false;
    
}catch{
    //error
}
        let alertToRemove = allPriceAlerts.filter(item => item.id === productID);
        let index = allPriceAlerts.indexOf(alertToRemove[0])
        allPriceAlerts.splice(index, 1)
        calcPriceAlerts();
}









//Function the calculates all the price alerts in the price alert array
function calcPriceAlerts(){
    //Select the view
    let priceAlertContent = popover.querySelector('.priceAlertContent');
    let priceAlertList = popover.querySelector('.priceAlertsList');

    //If/else for displaying the price alert wrapper in the popover
    if(allPriceAlerts.length < 1){
        priceAlertList.style.display = 'none';
    }else{
    priceAlertList.style.display = 'block';
    priceAlertContent.innerHTML = '';

    for(i = 0; i < allPriceAlerts.length; i++){
        let id = allPriceAlerts[i].id;

        //HTML for the price alert item
        let priceAlerthtml = `
        <div class='itemWrapper'>
        <span class="closeButton product" style="float: right; margin: 2px;"></span>
        <span style="float: right; margin-right: -20px; margin-top: 52px;" class="inputEuro"><input class="text" type="text" size="8" name="" id="" value="${allPriceAlerts[i].alertPrice}"></span>
        
        <div style='height: 80px; width: 80px; background-color: white; background-image: url("${allPriceAlerts[i].imageUrl}"); background-size: contain; background-repeat: no-repeat; background-position: center; float: left; border-top-left-radius: 2px; border-bottom-left-radius: 2px' class="imageProduct" >
        </div>
        <div class='itemInfo'>
        <ul style="list-style-type: none; margin-left: 50px; padding-top: 10px;">
        <li style="max-width: 200px; max-height: 16px; overflow: hidden; font-weight: bolder; font-size: 14px; word-wrap: break-word;"><span class='titleProduct'><a>${allPriceAlerts[i].title}</a></span></li>
        <li style="max-width: 150px; font-size: 12px; word-wrap: break-word; overflow: hidden; margin-top: 5px; max-height: 16px;"> <span class='speclineProduct'><a style="color: #666666;">${allPriceAlerts[i].specline}</a></span></li>
        <li style="margin-top: 10px; margin-bottom: 10px; font-size: 13px;"><span class='priceProduct'><a>${allPriceAlerts[i].price}</a></span></li>
        </ul>
        </div>
        </div>
        `;
        let priceAlertItem = document.createElement('div');
        priceAlertItem.innerHTML = priceAlerthtml;
        priceAlertContent.appendChild(priceAlertItem);

        let deleteBtn = priceAlertItem.querySelector('.closeButton');
        deleteBtn.addEventListener('click', () =>{
            deletePriceAlert(id);
        })
    }
    }
}















function createNotification(category, productID = null){
    let popupNotification = document.createElement('div');
    popupNotification.className = 'popup-notification';

if(category === 'prijsalert'){
    let product = productsOnPage.filter(item => item.id === productID)
    let popupNotificationHTML = `<div class="popup-notificationWrapper">
    <div class="textArea">
    <p class="pop-upTitle">Prijsalert instellen</p>
    <p class="announcementText" style="margin-bottom: 0px;">Je gaat een prijsalert instellen voor <span style="font-weight: bolder;">${product[0].title}</span></p>
    <span style="margin-top: 15px;" class="inputEuro"><input class="text" type="text" size="8" name="product" id="fsdfgb" value=""></span>
    </div>
    <a style="line-height: 50px; text-align: center; font-size: 14px; font-weight: bolder; width: 100%; height: 50px; margin-top: 5px;" class="ctaButton">Prijsalert instellen</a>
    </div`;
    
    popupNotification.innerHTML = popupNotificationHTML;
}else if(category === 'newlist'){
    popupNotificationHTML = `<div class="popup-notificationWrapper">
    <div class="textArea">
    <p class="pop-upTitle">Nieuwe lijst maken</p>
    <p class="announcementText" style="margin-bottom: 0px;">Typ de naam van de nieuwe lijst</p>
    <span style="margin-top: 15px;"><input class="text" type="text" size="30" name="product" id="" value=""></span>
    </div>
    <a style="line-height: 50px; text-align: center; font-size: 14px; font-weight: bolder; width: 100%; height: 50px; margin-top: 5px;" class="ctaButton">Nieuwe lijst aanmaken</a>
    </div`;
    popupNotification.innerHTML = popupNotificationHTML;
}else if(category === 'addToList'){
  
    popupNotificationHTML = `<div class="popup-notificationWrapper">
    <div class="textArea">
    <p class="pop-upTitle"><span>zoveel</span> producten toevoegen aan lijst</p>
    <ul class="lists" style="list-style-type: none">
    </ul>
    </div>
    <a style="line-height: 50px; text-align: center; font-size: 14px; font-weight: bolder; width: 100%; height: 50px; margin-top: 5px;" class="ctaButton">Toevoegen</a>
    </div`;
    popupNotification.innerHTML = popupNotificationHTML;

    popover.appendChild(popupNotification);
    let ul = popupNotification.querySelector('ul');
    
    for(i = 0; i < lists.length; i++){
    let selectListItem = document.createElement('li');
    let addToListButton = document.createElement('button');
    let listID = lists[i].id;
    addToListButton.setAttribute('list-id', listID)    

    addToListButton.className = 'addItem';
    
    let selectListItemHTML = `
    <span style="font-weight: bolder; font-size: 14px">${lists[i].name}</span>
    <br>
    <span style="font-weight: lighter; font-size: 11px;">${lists[i].products.length} producten in lijst</span>
    `
    selectListItem.innerHTML = selectListItemHTML;
    selectListItem.appendChild(addToListButton);
    ul.appendChild(selectListItem);
    }
    }
    popover.appendChild(popupNotification);
    return popupNotification;
}




function calcLists(){
    let allLists = popover.querySelector('.all-lists');
    allLists.innerHTML = '';

    for(i = 0; i < lists.length; i++){
        let id = lists[i].id;

        let listHTML = `
        <div class="list-options-top" style="width: auto;">
        <span class="list-title" style="width: auto; margin-left: 10px;">${lists[i].name}<span> (${lists[i].products.length})</span></span>
        <button class="option share" style="float: right; margin-right: 10px; height: 20px; width: 20px;"></button>
        <button class="option collapse" style="float: right; margin-right: 5px; height: 20px; width: 20px;"></button>
        </div>
        <div class='list-content' style="background-color: #D9D9D9; width: 355px; height: 120px; margin: 0 auto; margin-top: 15px;">
        </div>
        <div class="list-options-bottom" style="text-align: right">
        <button class="ctaButton secondary" style="margin-top: 10px; margin-right: -5px; text-align: right;">Verwijder lijst</button>
        <button class="ctaButton secondary" style=" margin-top: 10px; margin-right: 10px;">Totaal berekenen</button>
        </div>
        `
        let list = document.createElement('div');
        list.className = 'list-wrapper';
        list.setAttribute('list-id', id);
        list.innerHTML = listHTML;
        allLists.appendChild(list);

        let collapseBtn = list.querySelector('.collapse');
        let listContent = list.querySelector('.list-content');
        console.log(listContent);
        collapseBtn.addEventListener('click', () => {
            if(listContent.className === 'list-content'){
                listContent.classList.add('collapsed');
                collapseBtn.style.transform = 'rotate(-180deg)';
            }else{
                listContent.classList.remove('collapsed');
                collapseBtn.style.transform = 'rotate(0deg)';
            }
        })
    }
}









function createNewList(){
    let notification = createNotification('newlist');
    let submitButton = notification.querySelector('.ctaButton');
    let id = Math.floor((Math.random() * 11000) + 22000);

    submitButton.addEventListener('click', () => {
        let listName = notification.querySelector('input').value;
        lists.push({
            id: id,
            name: listName,
            products: [],
        });
        notification.style.display = 'none';
        calcLists();
    })
}













function addToList(productID){
    let selectedProduct = productsMPO.filter(item => item.id === productID);
    selectedProduct[0].selected = true;

    let notification = createNotification('addToList', productID)
    let buttons = notification.querySelectorAll('.addItem');

    
        for(i = 0; i < buttons.length; i++){
            let listID = buttons[i].getAttribute('list-id');
        buttons[i].addEventListener('click', () =>{
            
         
            let selectedProducts = Array.from(productsMPO.filter(item => item.selected === true));
         
            let selectedList = lists.filter(item => item.id == listID);
            for(i = 0; i < selectedProducts.length; i++){
                selectedList[0].products.push(selectedProducts[i]);
            }
            console.log(lists);
        })
    }
    
}













//Function for updating the counter
function updateCounter(){
let introText = popover.querySelector('.introText');
let suggestionItemWrapper = popover.querySelector('.suggestion-item-wrapper');

    let counter1 = popover.querySelector('.counter1');
    let counter2 = popover.querySelector('.counter2');
    let counter3 = popover.querySelector('.counter3');

    //Set the innertext to the updated count int
    counter1.innerText = mpoCounter;
    counter2.innerText = mpoCounter;
    counter3.innerText = mpoCounter;

    if(mpoCounter < 1){
        introText.style.display = 'block';
        suggestionItemWrapper.style.display = 'block';
    }else{
        introText.style.display = 'none';
        suggestionItemWrapper.style.display ='none';
    }
}












//Search compare icon content and add a eventlistener to it
let iconHeader = document.querySelector('.icon.compare');
console.log(iconHeader);
iconHeader.addEventListener('click', () => {
try{
    let popupCompare = document.querySelector('.popup');
    iconHeader.className = 'icon compare';
    let parent = popupCompare.parentElement;
    parent.removeChild(popupCompare);
}catch{
    //error
}
        if(popover.style.display == 'none'){
        popover.style.display = 'block';
        iconHeader.classList.add('selected');
        }else{
        popover.style.display = 'none';
        iconHeader.classList.remove('selected');
}
});















// Make the DIV element draggable:
dragElement(document.querySelector(".pop-over"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//Adding css to the javascript code
let head = document.querySelector('head');
let style = document.createElement('style');
style.innerHTML = `

.popover.wrapper{
   width: 375px; 
   height: 50px; 
   margin-bottom: 3px;
}

.pop-over{
    z-index: 200;
    position: fixed;
    top: 50px;
    cursor: move;
    left: 550px;
    display: block;
    box-shadow:  8px 5px 5px -3px rgba(0,0,0,0.1), 5px 8px 5px -3px rgba(0,0,0,0.1);
    border-color: #cccccc;
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
}

.tabbar button{
    line-heigth: 50px;
    width: 49.8%;
    border: none;
    background-color: white;
    color: #1668ac;
    font-size: 16px;
    height: 50px;
}

.contentWrapper{
    width: 375px;
    height: 700px;
    background-color: #f2f2f2;
    border-radius: 2px;
    overflow-x: hidden;
    overflow-y: scroll;
}

.contentWrapper.singleProducts{
    height: auto;
}

.suggestion-item{
    width: 125px;
    height: 125px;
    background-color: white;
    margin: 10px; 
    float: left;
    border-radius: 2px;

    background-repeat: no-repeat;
    background-size: fit;
    background-position: center center;
}

.suggestion-item-wrapper{
    width: 80%;
    margin: 0 auto;
}

.suggestion-item-content{
    width: 100%;
    height: 100%;
    float: right;
  
}

.addItem{
    float: right;
    width: 25px;
    height: 25px;
    background-color: #0A95CD;
    margin: 5px;
    border: none;
    background-image: url('data:image/svg+xml, %3Csvg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M5.45597 3.22974H8.01187V5.07764H5.45597V7.96631H3.50894V5.07764H0.945955V3.22974H3.50894V0.461426H5.45597V3.22974Z" fill="white"/%3E%3C/svg%3E');
    background-size: fit;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 2px;
}

.addItem.active{
    background-color: #9FBF22;
    background-image: url('data:image/svg+xml, %3Csvg width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M4.45426 2.4104H0.468172V0.760742H4.45426V2.4104Z" fill="white"/%3E%3C/svg%3E');
}

.itemWrapper{
    height: 80px;
    margin: 0 auto;
    width: 355px;
    left: 0;
    right: 0;
    background-color: #E5E5E5;
    border-radius: 2px;
    
}

.itemWrapper ul{
    list-style-type: none;
    margin-left: 50px;
    padding-top: 10px;
}

.introText{
    display: block;
    width: 77%;
    text-align: center;
    margin: 0 auto;
    margin-top: 40px;
}

.titleProduct{
    max-width: 200px;
    max-height: 16px;
    overflow: hidden;
    font-weight: bolder;
    font-size: 14px;
    word-wrap: break-word;
}

.speclineProduct{
    max-width: 150px;
    font-size: 12px;
    word-wrap: break-word;
    overflow: hidden;
    margin-top: 5px;
    max-height: 16px;
}

.priceProduct{
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 13px;
}

.closeButton{
    float: right; 
    margin: 2px;
}

.productItem{
    margin-bottom: 40px;
}

.imageProduct{
    height: 80px;
    width: 80px;
    background-color: white;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    float: left;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
}

.topInfo{
    margin-top: 25px; 
    margin-bottom: 35px; 
}

.topInfo a{
    float: right; 
    margin-right: 15px; 
    margin-top: -2px;" 
}

.topTitle{
    margin-left: 15px;  
    font-weight: bolder; 
    font-size: 18px;
}

.bottom-info{
    text-align: center;
    margin-top: 50px; 
    margin-bottom: 50px;
}

.list-title{
    font-weight: bolder; 
    margin-left: 10px; 
    font-size: 14px;
}

.priceAlertsBlock{
    display: none;
}

/* width */
.contentWrapper::-webkit-scrollbar {
  display: none;
}

/* Track */
.contentWrapper::-webkit-scrollbar-track {
  display: none;
}
 
/* Handle */
.contentWrapper::-webkit-scrollbar-thumb {
  background: #888; 
  overflow: overlay;
  position: absolute;
}

/* Handle on hover */
.contentWrapper::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
.option {
    background-color: #D9D9D9;
    background-position: center center;
    background-size: contain; 
    background-repeat: no-repeat;
    background-size: 16px;
    border-radius: 2px;
    height: 35px;
    width: 35px;
    text-align: center;
}

.option.active{
    background-color: #9FBF22;
}

.option.addList{
    background-image: url("data:image/svg+xml,%3Csvg width='18' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'%3E%3Crect y='3.63312' width='13.3333' height='1.45326' fill='%231668AC'/%3E%3Crect width='13.3333' height='1.45326' fill='%231668AC'/%3E%3Crect y='7.2663' width='8' height='1.45326' fill='%231668AC'/%3E%3Crect y='10.8994' width='8' height='1.45326' fill='%231668AC'/%3E%3Cpath d='M14.2757 9.65405H17.0511V10.8503H14.2757V13.9949H13.0042V10.8503H10.2288V9.65405H13.0042V6.74878H14.2757V9.65405Z' fill='%231668AC'/%3E%3C/svg%3E");
}

.option.setAlert{
    background-image: url("data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M16.9896 8.58849C16.6885 8.58849 16.4442 8.34349 16.4442 8.04161C16.4442 5.94744 15.6312 3.97944 14.1549 2.4985C13.9419 2.28487 13.9419 1.93854 14.1549 1.72491C14.368 1.51129 14.7134 1.51129 14.9266 1.72491C16.6086 3.41214 17.535 5.65585 17.535 8.04161C17.535 8.34349 17.2906 8.58849 16.9896 8.58849Z' fill='%231668AC'/%3E%3Cpath d='M2.08155 8.58855C1.78048 8.58855 1.53613 8.34356 1.53613 8.04168C1.53613 5.65591 2.46265 3.4122 4.14537 1.72565C4.35842 1.51202 4.70397 1.51202 4.91702 1.72565C5.13008 1.93927 5.13008 2.28574 4.91702 2.49936C3.44003 3.9795 2.62697 5.94751 2.62697 8.04168C2.62697 8.34356 2.38262 8.58855 2.08155 8.58855Z' fill='%231668AC'/%3E%3Cpath d='M9.53568 18.25C8.03179 18.25 6.80859 17.0235 6.80859 15.5156C6.80859 15.2137 7.05294 14.9688 7.35401 14.9688C7.65508 14.9688 7.89943 15.2137 7.89943 15.5156C7.89943 16.4206 8.63313 17.1562 9.53568 17.1562C10.4381 17.1562 11.1719 16.4206 11.1719 15.5156C11.1719 15.2137 11.4163 14.9688 11.7173 14.9688C12.0184 14.9688 12.2628 15.2137 12.2628 15.5156C12.2628 17.0235 11.0396 18.25 9.53568 18.25Z' fill='%231668AC'/%3E%3Cpath d='M15.5356 16.0625H3.5364C2.83452 16.0625 2.26367 15.4901 2.26367 14.7865C2.26367 14.4131 2.42586 14.0595 2.70882 13.8167C3.81483 12.8797 4.44534 11.5177 4.44534 10.0746V8.04162C4.44534 5.22714 6.72887 2.9375 9.53598 2.9375C12.343 2.9375 14.6265 5.22714 14.6265 8.04162V10.0746C14.6265 11.5177 15.257 12.8797 16.3558 13.8116C16.646 14.0595 16.8082 14.4131 16.8082 14.7865C16.8082 15.4901 16.2373 16.0625 15.5356 16.0625ZM9.53598 4.03125C7.33021 4.03125 5.53617 5.83009 5.53617 8.04162V10.0746C5.53617 11.8398 4.76465 13.5068 3.42002 14.6464C3.39459 14.6683 3.35451 14.7136 3.35451 14.7865C3.35451 14.8856 3.43746 14.9688 3.5364 14.9688H15.5356C15.6344 14.9688 15.7173 14.8856 15.7173 14.7865C15.7173 14.7136 15.6774 14.6683 15.6533 14.6479C14.3072 13.5068 13.5357 11.8398 13.5357 10.0746V8.04162C13.5357 5.83009 11.7416 4.03125 9.53598 4.03125Z' fill='%231668AC'/%3E%3Cpath d='M9.53565 4.03125C9.23458 4.03125 8.99023 3.78625 8.99023 3.48438V1.29688C8.99023 0.994999 9.23458 0.75 9.53565 0.75C9.83672 0.75 10.0811 0.994999 10.0811 1.29688V3.48438C10.0811 3.78625 9.83672 4.03125 9.53565 4.03125Z' fill='%231668AC'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Crect width='17.4533' height='17.5' fill='white' transform='translate(0.820312 0.75)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
}

.option.setAlert.active{
    background-image: url("data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M16.9896 8.58846C16.6885 8.58846 16.4442 8.34346 16.4442 8.04158C16.4442 5.94741 15.6312 3.97941 14.1549 2.49847C13.9419 2.28484 13.9419 1.93851 14.1549 1.72488C14.368 1.51126 14.7134 1.51126 14.9266 1.72488C16.6086 3.41211 17.535 5.65582 17.535 8.04158C17.535 8.34346 17.2906 8.58846 16.9896 8.58846Z' fill='white'/%3E%3Cpath d='M2.08155 8.58852C1.78048 8.58852 1.53613 8.34352 1.53613 8.04165C1.53613 5.65588 2.46265 3.41217 4.14537 1.72562C4.35842 1.51199 4.70397 1.51199 4.91702 1.72562C5.13008 1.93924 5.13008 2.28571 4.91702 2.49933C3.44003 3.97947 2.62697 5.94748 2.62697 8.04165C2.62697 8.34352 2.38262 8.58852 2.08155 8.58852Z' fill='white'/%3E%3Cpath d='M9.53568 18.25C8.03179 18.25 6.80859 17.0235 6.80859 15.5156C6.80859 15.2137 7.05294 14.9688 7.35401 14.9688C7.65508 14.9688 7.89943 15.2137 7.89943 15.5156C7.89943 16.4206 8.63313 17.1562 9.53568 17.1562C10.4381 17.1562 11.1719 16.4206 11.1719 15.5156C11.1719 15.2137 11.4163 14.9688 11.7173 14.9688C12.0184 14.9688 12.2628 15.2137 12.2628 15.5156C12.2628 17.0235 11.0396 18.25 9.53568 18.25Z' fill='white'/%3E%3Cpath d='M15.5356 16.0625H3.5364C2.83452 16.0625 2.26367 15.4901 2.26367 14.7865C2.26367 14.4131 2.42586 14.0595 2.70882 13.8167C3.81483 12.8797 4.44534 11.5177 4.44534 10.0746V8.04162C4.44534 5.22714 6.72887 2.9375 9.53598 2.9375C12.343 2.9375 14.6265 5.22714 14.6265 8.04162V10.0746C14.6265 11.5177 15.257 12.8797 16.3558 13.8116C16.646 14.0595 16.8082 14.4131 16.8082 14.7865C16.8082 15.4901 16.2373 16.0625 15.5356 16.0625ZM9.53598 4.03125C7.33021 4.03125 5.53617 5.83009 5.53617 8.04162V10.0746C5.53617 11.8398 4.76465 13.5068 3.42002 14.6464C3.39459 14.6683 3.35451 14.7136 3.35451 14.7865C3.35451 14.8856 3.43746 14.9688 3.5364 14.9688H15.5356C15.6344 14.9688 15.7173 14.8856 15.7173 14.7865C15.7173 14.7136 15.6774 14.6683 15.6533 14.6479C14.3072 13.5068 13.5357 11.8398 13.5357 10.0746V8.04162C13.5357 5.83009 11.7416 4.03125 9.53598 4.03125Z' fill='white'/%3E%3Cpath d='M9.53565 4.03125C9.23458 4.03125 8.99023 3.78625 8.99023 3.48438V1.29688C8.99023 0.994999 9.23458 0.75 9.53565 0.75C9.83672 0.75 10.0811 0.994999 10.0811 1.29688V3.48438C10.0811 3.78625 9.83672 4.03125 9.53565 4.03125Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Crect width='17.4533' height='17.5' fill='white' transform='translate(0.820312 0.75)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
}

.option.addList.active{
    background-image: url('data:image/svg+xml, %3Csvg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect y="3.63312" width="13.3333" height="1.45326" fill="white"/%3E%3Crect width="13.3333" height="1.45326" fill="white"/%3E%3Crect y="7.2663" width="8" height="1.45326" fill="white"/%3E%3Crect y="10.8994" width="8" height="1.45326" fill="white"/%3E%3Cpath d="M15.3216 11.281H11.9857V10.2488H15.3216V11.281Z" fill="white"/%3E%3C/svg%3E');
}

.popup-notificationWrapper{
    float: right;
    height: auto;
    width: 322px;
    margin-left: 101%;
    margin-top: 53px;
    top: 0;
    position: absolute;
    cursor: pointer;
    border-radius: 2px;
    box-shadow: 8px 5px 5px -3px rgba(0,0,0,0.1), 5px 8px 5px -3px rgba(0,0,0,0.1);
}
.pop-upTitle{
    font-size: 16px;
    font-weight: bolder;
    margin-bottom: 5px;
}

.textArea{
    height: auto;
    width: 322px;
    background-color: white;
    padding: 15px;
    padding-right: 7px;
    box-shadow: 8px 5px 5px -3px rgba(0,0,0,0.1), 5px 8px 5px -3px rgba(0,0,0,0.1);
}

.list-wrapper{
    margin-bottom: 40px;
}

.list-content{
    display: block;
}
.list-content.collapsed{
    display: none;
}

.list-options-top button{
    background-color: #1668AC;
    border-radius: 2px;
    border: none;
    background-size: 11px;
    background-position: center center;
    background-repeat: no-repeat;
}

.collapse{
    background-image: url('data:image/svg+xml, %3Csvg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M5.53176 0.666452L0.191706 6.0066C0.068097 6.13011 0 6.29499 0 6.4708C0 6.6466 0.068097 6.81148 0.191706 6.93499L0.584873 7.32825C0.841066 7.58415 1.25745 7.58415 1.51326 7.32825L5.99751 2.844L10.4867 7.33323C10.6104 7.45674 10.7751 7.52493 10.9508 7.52493C11.1267 7.52493 11.2915 7.45674 11.4152 7.33323L11.8083 6.93996C11.9319 6.81635 12 6.65157 12 6.47577C12 6.29997 11.9319 6.13509 11.8083 6.01158L6.46336 0.666452C6.33936 0.542648 6.1738 0.474648 5.99781 0.475039C5.82112 0.474648 5.65566 0.542648 5.53176 0.666452Z" fill="white"/%3E%3C/svg%3E');
}
.share{
    background-image: url('data:image/svg+xml, %3Csvg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M4.44473 3.00859C3.03077 4.47153 3.33933 6.89934 4.95899 7.97483C5.01236 8.01028 5.08336 8.00325 5.1292 7.95846C5.47018 7.62529 5.75864 7.30257 6.01122 6.89214C6.04987 6.82935 6.02583 6.74786 5.961 6.71274C5.71395 6.5789 5.46812 6.32793 5.32973 6.06283L5.32957 6.06293C5.16379 5.73282 5.10735 5.36279 5.19512 4.98064C5.19521 4.98066 5.1953 4.98068 5.1954 4.98068C5.29639 4.49142 5.82165 4.03629 6.22282 3.61538C6.22197 3.6151 6.22115 3.61479 6.22031 3.61451L7.7234 2.0804C8.3224 1.46904 9.30768 1.464 9.9129 2.06922C10.5242 2.6682 10.5343 3.65845 9.93536 4.26979L9.02492 5.20602C8.98279 5.24935 8.96912 5.31257 8.98884 5.36971C9.19846 5.9776 9.25002 6.83474 9.10955 7.48233C9.10561 7.50045 9.12798 7.51232 9.14094 7.49907L11.0786 5.52137C12.3165 4.25799 12.306 2.20104 11.0553 0.950372C9.77896 -0.325972 7.70112 -0.31535 6.43788 0.973937L4.4525 3.00029C4.44987 3.00306 4.44738 3.00587 4.44473 3.00859Z" fill="white"/%3E%3Cpath d="M8.06699 8.25341C8.06697 8.25348 8.06692 8.25355 8.0669 8.25362C8.06814 8.25311 8.06929 8.25261 8.07053 8.25207C8.46598 7.52896 8.54383 6.69963 8.35849 5.89117L8.35765 5.89203L8.35674 5.89164C8.18076 5.17157 7.6979 4.45655 7.0421 4.01631C6.98569 3.97844 6.89558 3.98283 6.84275 4.02555C6.51056 4.29415 6.18541 4.63857 5.97086 5.07811C5.93716 5.14711 5.96239 5.23 6.0288 5.26855C6.27779 5.41311 6.50266 5.62475 6.65322 5.90573L6.65345 5.90556C6.77078 6.10405 6.88641 6.48067 6.81151 6.88534C6.81147 6.88534 6.8114 6.88534 6.81135 6.88534C6.74148 7.42185 6.19969 7.91398 5.76899 8.35743L5.7692 8.35764C5.44135 8.6929 4.60794 9.54251 4.27423 9.88344C3.67525 10.4948 2.685 10.5049 2.07366 9.90591C1.46232 9.30693 1.45222 8.31667 2.0512 7.70534L2.96433 6.76629C3.00572 6.72373 3.01979 6.66188 3.00138 6.60544C2.79863 5.98334 2.74308 5.14552 2.87106 4.49866C2.87462 4.48063 2.85244 4.46912 2.83957 4.48225L0.931017 6.43019C-0.319512 7.70653 -0.308913 9.78459 0.954605 11.0481C2.23088 12.2986 4.29822 12.2774 5.5487 11.0012C5.98312 10.5152 7.84273 8.79346 8.06699 8.25341Z" fill="white"/%3E%3C/svg%3E');

}

.popup-notification ul{
    max-height: 270px;
    height: auto;
    margin-left: 0px;
    padding-left: 0px;
    width: 290px;
}

.popup-notification ul li{
    max-height: 50px;
    width: 100%;
    background-color: #F2F2F2;
    margin-bottom: 5px;
    padding: 10px;
}

`
head.appendChild(style);