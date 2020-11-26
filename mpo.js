//JSON data that gets all the products when the page loads
let productsOnPage = [];
let productsMPO = [];
let productsCompare = [];
let allPriceAlerts = [];

//All the counters that are counting products
let mpoCounter = 0;
let compareCounter = 0;
let listCounter = 0;

//Grab all the list items on a pricewatch page
let listsItems = document.querySelector('.listing.useVisitedState').querySelectorAll('.largethumb');


//Add the checkbox the to all the products in the list on a pricewatch page
for(i=0; i < listsItems.length; i++){
let id = listsItems[i].querySelector('input').getAttribute('value');
let title = listsItems[i].querySelector('.itemname').querySelector('.ellipsis').querySelector('a').innerText;
let specline = listsItems[i].querySelector('.itemname').querySelector('.specline.ellipsis').querySelector('a').innerText;
let price = listsItems[i].querySelector('.price').querySelector('a').innerText;
let imageUrl = listsItems[i].querySelector('.pwimage').querySelector('a').querySelector('img').getAttribute('src');

//Set the HTML for the checkbox
let checkBoxhtml = `<input type="checkbox" name="products[] value="${id}"">
<span>Mijn Producten</span>`;

//Create a new label and set the innerHTML to the checkbox HTML
let label = document.createElement('label');
label.removeEventListener('click', () => {});
label.className = 'mpo checkbox unselected';
label.innerHTML = checkBoxhtml;
let itemName = listsItems[i].querySelector('.itemname');
itemName.appendChild(label);
    
//Push the data to a JSON file
    productsOnPage.push({
        id: id,
        title: title,
        specline: specline,
        price: price,
        imageUrl: imageUrl,
        priceAlert: false,  
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

//HTML for the new popover element
let html = `
<div class="wrapper">
<div style="width: 375px; height: 50px; margin-bottom: 3px;" class="tabbar">
<button style="float: left; border-top-left-radius: 2px;" class="active button-tab mpo-tab"><span>Mijn Producten(<span class="counter1">${mpoCounter}</span>)</span></button>
<button style="float: right; border-top-right-radius: 2px" class="inactive button-tab compare-tab"><span>Vergelijk<span>(0)</span</span></button>
</div>
<div class="contentWrapper">
<div style="margin-top: 25px; margin-bottom: 35px; class="topInfo">
<span style="margin-left: 15px;  font-weight: bolder; font-size: 18px;">Mijn Producten(<span class="counter2">${mpoCounter}</span>)</span>
<a style="float: right; margin-right: 15px; margin-top: -2px;" class="ctaButton">Nieuwe lijst maken</a>
</div>
<div style="height: auto;" class="content"></div>


<div style="margin-top: 40px;" class="priceAlertsBlock">
<span style="font-weight: bolder; margin-left: 10px; font-size: 14px;">Mijn Prijsalerts</span>
<div class="priceAlertContent">
<span class="alertAnnounce">Je hebt nog geen Prijsalerts ingesteld</span>
</div>
</div>

<div style="text-align: center; margin-top: 50px; margin-bottom: 50px;" class="bottomInfo">
<p style="margin-bottom: 5px; font-size: 12px;"><a href="#"><span>${listCounter}</span> lijsten, met in totaal <span class="counter3">${mpoCounter}</span> producten</a></p>
<p style="margin-bottom: 15px; font-size: 18px; font-weight: bolder;">Meer producten toevoegen?</p>
<a class="ctaButton">Bekijk Pricewatch</a>
</div>
</div
</div>
`
let popupNotificationHTML = `<div class="popup-notificationWrapper">

<div class="textArea">
<p class="pop-upTitle">Weet je het zeker?</p>
<p class="announcementText" style="margin-bottom: 0px;">Je gaat ‘naam van lijst’ verwijderen. Hierin heb je ‘aantal producten’ opgeslagen</p>
</div>

<a style="line-height: 50px; text-align: center; font-size: 14px; font-weight: bolder; width: 100%; height: 50px; margin-top: 5px;" class="ctaButton">Verwijder lijst</a>
</div`;
let popupNotification = document.createElement('div');
popupNotification.innerHTML = popupNotificationHTML;


//Create a new popover and set the styling and innerHTML
let popover = document.createElement('div');
popover.innerHTML = html;
popover.style.zIndex = '200';
popover.style.position = 'fixed';
popover.style.cursor = 'move';
popover.style.top = '50px';
popover.style.left = '550px';
popover.className = 'pop-over';
popover.style.display = 'block';
popover.style.boxShadow = '8px 5px 5px -3px rgba(0,0,0,0.1), 5px 8px 5px -3px rgba(0,0,0,0.1)';

popover.appendChild(popupNotification);


//Append the new popover to the body
let body = document.querySelector('body');
body.appendChild(popover);

//Style the wrapper for the content
let contentWrapper = popover.querySelector('.contentWrapper');
contentWrapper.style.width = '375px';
contentWrapper.style.height = '700px';
contentWrapper.style.backgroundColor = '#f2f2f2';
contentWrapper.style.borderRadius = '2px';
contentWrapper.style.overflowX = 'hidden';
contentWrapper.style.overflowY = 'scroll';
let content = contentWrapper.querySelector('.content');

//Style the tab buttons in the tabbar and add an event listener
let tabButtons = document.querySelector('.tabbar').querySelectorAll('button');
for(i = 0; i < tabButtons.length; i++){
    tabButtons[i].style.lineHeight = '50px';
    tabButtons[i].style.width = '49.8%';
    tabButtons[i].style.border = 'none';
    tabButtons[i].style.backgroundColor = 'white';
    tabButtons[i].style.color = '#1668ac';
    tabButtons[i].style.fontSize = '16px';
}

//Function for adding products to the content listview
function addToMPO(productID, label){
    //Create new item element
    let item = document.createElement('div');

    //Set the attribute id to the productID and style the element
    item.setAttribute('id', productID);
    item.className = 'productItem';
    item.style.marginBottom = "40px";
   
 
    //Filter the product that needs to be added
    let productAdd = productsOnPage.filter(item => item.id === productID)

           //Define the properties that needs to be defined
           let title = productAdd[0].title;
           let image = productAdd[0].imageUrl;
           let specs = productAdd[0].specline;
           let price = productAdd[0].price;

           //HTML for the list item and add the properties
           let itemHTML = `
           <div style='height: 80px; margin: 0 auto; width: 355px; left: 0; right: 0; background-color: #E5E5E5; border-radius: 2px;' class='itemWrapper'>
           <span class="closeButton product" style="float: right; margin: 2px;"></span>
           <div class='option setAlert' style="margin-top: 43px; margin-right: -20px; float: right;">

           </div>
           <div class='option addList' style="margin-top: 43px; margin-right: 5px; float: right;">
           </div>
           <div style='height: 80px; width: 80px; background-color: white; background-image: url("${image}"); background-size: contain; background-repeat: no-repeat; background-position: center; float: left; border-top-left-radius: 2px; border-bottom-left-radius: 2px' class="imageProduct" >
           </div>
           <div class='itemInfo'>
           <ul style="list-style-type: none; margin-left: 50px; padding-top: 10px;">
           <li style="max-width: 200px; max-height: 16px; overflow: hidden; font-weight: bolder; font-size: 14px; word-wrap: break-word;"><span class='titleProduct'><a>${title}</a></span></li>
           <li style="max-width: 150px;  font-size: 12px; word-wrap: break-word; overflow: hidden; margin-top: 5px; max-height: 16px;"> <span class='speclineProduct'><a style="color: #666666;">${specs}</a></span></li>
           <li style="margin-top: 10px; margin-bottom: 10px; font-size: 13px;"><span class='priceProduct'><a>${price}</a></span></li>
           </ul>
           </div>
           <label style="float: right;" class="compare ctaButton unselected checkbox"><input type="checkbox" name="products[]" value="${productID}"><span>vergelijk</span></label>
           </div>
           `;

           //Push the product to the productsMPO array
           productsMPO.push({
            id: productID,
            title: title,
            specline: specs,
            price: price,
            imageUrl: image,
            priceAlert: false,  
        });
        
        //Set the innerHTML for the item to the itemHTML and append it to the contentview
           item.innerHTML = itemHTML;
           content.appendChild(item);
           mpoCounter++;
           updateCounter();



           //Add eventlistener to the delete button
           let deletebtn = item.querySelector('.closeButton');
           deletebtn.addEventListener('click', () => {
           deleteFromMPO(productID, label);
           })

           let priceAlert = item.querySelector('.setAlert');
           priceAlert.addEventListener('click', () =>{
               if(priceAlert.className == 'option setAlert'){
               setPriceAlert(productID, priceAlert);
               }else{
                   deletePriceAlert(productID, priceAlert)
               }
           })
    }



//Function that removes the product with the right ID from the content listview div
function deleteFromMPO(productID, label){
label.classList.remove('selected');
    label.classList.add('unselected');
    let addedProducts = content.querySelectorAll('.productItem');

    //Search for the product with the right ID
    for(i = 0; i < addedProducts.length; i++){
        if(addedProducts[i].getAttribute("id") == productID){
            mpoCounter--;
            updateCounter();
            content.removeChild(addedProducts[i]);
        }else{
            //nothing
        }
    }
}

function setPriceAlert(productID, alert){
    let product = productsMPO.filter(item => item.id === productID)
    product[0].priceAlert = true;
    allPriceAlerts.push(product[0]);
    alert.classList.add('active');
    calcPriceAlerts();
}

function deletePriceAlert(productID, alert){
try{
    let product = productsMPO.filter(item => item.id === productID)
    product[0].priceAlert = false;
    alert.classList.remove('active');
}catch{
    //error
}
        let alertToRemove = allPriceAlerts.filter(item => item.id === productID)
        console.log(alertToRemove[0])
        let index = allPriceAlerts.indexOf(alertToRemove[0])
        allPriceAlerts.splice(index, 1)
        calcPriceAlerts();
}

function calcPriceAlerts(){

    let priceAlertContent = popover.querySelector('.priceAlertContent');
    let block = popover.querySelector('.priceAlertsBlock');

    if(allPriceAlerts.length < 1){
        block.style.display = 'none';
    }else{

        console.log('succes');
    block.style.display = 'block';
    priceAlertContent.innerHTML = '';

    for(i = 0; i < allPriceAlerts.length; i++){
        let priceAlerthtml = `
        <div style='height: 80px; margin: 0 auto; width: 355px; left: 0; right: 0; background-color: #E5E5E5; border-radius: 2px;' class='itemWrapper'>
        <span class="closeButton product" style="float: right; margin: 2px;"></span>
        <span style="float: right; margin-right: -20px; margin-top: 52px;" class="inputEuro"><input class="text" type="text" size="8" name="" id="" value="100,00"></span>
        
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
    }
    }

}

//Function for updating the counter
function updateCounter(){
    let counter1 = popover.querySelector('.counter1');
    let counter2 = popover.querySelector('.counter2');
    let counter3 = popover.querySelector('.counter3');

    //Set the innertext to the updated count int
    counter1.innerText = mpoCounter;
    counter2.innerText = mpoCounter;
    counter3.innerText = mpoCounter;
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
    e.preventDefault();
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

.priceAlertsBlock{
    display: none;
}

.contentWrapper::-webkit-scrollbar {
    display: none;
  }

.option {
    background-color: #D9D9D9;
    background-position: center center;
    background-size: contain; 
    background-repeat: no-repeat;
    background-size: 18px;
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
    background-image: url("data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M16.9896 8.58846C16.6885 8.58846 16.4442 8.34346 16.4442 8.04158C16.4442 5.94741 15.6312 3.97941 14.1549 2.49847C13.9419 2.28484 13.9419 1.93851 14.1549 1.72488C14.368 1.51126 14.7134 1.51126 14.9266 1.72488C16.6086 3.41211 17.535 5.65582 17.535 8.04158C17.535 8.34346 17.2906 8.58846 16.9896 8.58846Z' fill='white'/%3E%3Cpath d='M2.08155 8.58852C1.78048 8.58852 1.53613 8.34352 1.53613 8.04165C1.53613 5.65588 2.46265 3.41217 4.14537 1.72562C4.35842 1.51199 4.70397 1.51199 4.91702 1.72562C5.13008 1.93924 5.13008 2.28571 4.91702 2.49933C3.44003 3.97947 2.62697 5.94748 2.62697 8.04165C2.62697 8.34352 2.38262 8.58852 2.08155 8.58852Z' fill='white'/%3E%3Cpath d='M9.53568 18.25C8.03179 18.25 6.80859 17.0235 6.80859 15.5156C6.80859 15.2137 7.05294 14.9688 7.35401 14.9688C7.65508 14.9688 7.89943 15.2137 7.89943 15.5156C7.89943 16.4206 8.63313 17.1562 9.53568 17.1562C10.4381 17.1562 11.1719 16.4206 11.1719 15.5156C11.1719 15.2137 11.4163 14.9688 11.7173 14.9688C12.0184 14.9688 12.2628 15.2137 12.2628 15.5156C12.2628 17.0235 11.0396 18.25 9.53568 18.25Z' fill='white'/%3E%3Cpath d='M15.5356 16.0625H3.5364C2.83452 16.0625 2.26367 15.4901 2.26367 14.7865C2.26367 14.4131 2.42586 14.0595 2.70882 13.8167C3.81483 12.8797 4.44534 11.5177 4.44534 10.0746V8.04162C4.44534 5.22714 6.72887 2.9375 9.53598 2.9375C12.343 2.9375 14.6265 5.22714 14.6265 8.04162V10.0746C14.6265 11.5177 15.257 12.8797 16.3558 13.8116C16.646 14.0595 16.8082 14.4131 16.8082 14.7865C16.8082 15.4901 16.2373 16.0625 15.5356 16.0625ZM9.53598 4.03125C7.33021 4.03125 5.53617 5.83009 5.53617 8.04162V10.0746C5.53617 11.8398 4.76465 13.5068 3.42002 14.6464C3.39459 14.6683 3.35451 14.7136 3.35451 14.7865C3.35451 14.8856 3.43746 14.9688 3.5364 14.9688H15.5356C15.6344 14.9688 15.7173 14.8856 15.7173 14.7865C15.7173 14.7136 15.6774 14.6683 15.6533 14.6479C14.3072 13.5068 13.5357 11.8398 13.5357 10.0746V8.04162C13.5357 5.83009 11.7416 4.03125 9.53598 4.03125Z' fill='white'/%3E%3Cpath d='M9.53565 4.03125C9.23458 4.03125 8.99023 3.78625 8.99023 3.48438V1.29688C8.99023 0.994999 9.23458 0.75 9.53565 0.75C9.83672 0.75 10.0811 0.994999 10.0811 1.29688V3.48438C10.0811 3.78625 9.83672 4.03125 9.53565 4.03125Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Crect width='17.4533' height='17.5' fill='white' transform='translate(0.820312 0.75)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
}

.popup-notificationWrapper{
    float: right;
    height: auto;
    width: 322px;
    margin-left: 101%;
    margin-top: 53px;
    position: absolute;
    top: 0;
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


`
head.appendChild(style);

