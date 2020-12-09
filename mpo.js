//Search compare icon content and add a eventlistener to it
let iconCompare = document.querySelector('.icon.compare');
let iconFlag = document.querySelector('.icon.display.flag');
let userbar = document.querySelector('#userbar');

let iconMPO = document.createElement('li');
iconMPO.className = 'iconMPO';
let iconMPOHTML = `<a></a>`;
iconMPO.innerHTML = iconMPOHTML;
//Delete original icon
userbar.removeChild(iconCompare);
userbar.insertBefore(iconMPO, iconFlag);

//Add event listener to the icon in the header
 iconMPO.addEventListener('click', () => {
    changeState(iconMPO);
    if(iconMPO.classList.contains('active')){
        popover.style.display = 'block';
    }else{
        popover.style.display = 'none';
    }
});

//JSON data that gets all the products when the page loads
let productsOnPage = [];
let productsMPO = [];
let productsCompare = [];
let allPriceAlerts = [];
let lists = [];

//All the counters that are counting products
let mpoCounter = productsMPO.length + allPriceAlerts.length;
let compareCounter = productsCompare.length;
let listCounter = lists.length;
let selectedCounter = Array.from(productsMPO.filter(item => item.selected === true)).length

//Function to add a checkbox to products on a Pricewatch page
function addCheckbox() {
    //Grab all the list items on a pricewatch page
    let pricewatchItems = document.querySelector('.listing.useVisitedState').querySelectorAll('.largethumb');
    //Add the checkbox the to all the products in the list on a pricewatch page
    for (i = 0; i < pricewatchItems.length; i++) {
        //Specify some properties from each product
        let id = pricewatchItems[i].querySelector('input').getAttribute('value');
        let title = pricewatchItems[i].querySelector('.itemname').querySelector('.ellipsis').querySelector('a').innerText;
        let specline = pricewatchItems[i].querySelector('.itemname').querySelector('.specline.ellipsis').querySelector('a').innerText;
        let price = pricewatchItems[i].querySelector('.price').querySelector('a').innerText;
        let imageUrl = pricewatchItems[i].querySelector('.pwimage').querySelector('a').querySelector('img').getAttribute('src');
        let itemName = pricewatchItems[i].querySelector('.itemname');
        //Set the HTML for the checkbox
        let checkBoxhtml = `<input type="checkbox" name="products[] value="${id}"">
        <span>Mijn Producten</span>`;
        //Create a new label and set the innerHTML to the checkbox HTML
        let label = document.createElement('label');
        label.innerHTML = checkBoxhtml;
        let checkbox = label.querySelector('input');
        //Append the label to the item
        itemName.appendChild(label);
        //Push the properties to a JSON file
        productsOnPage.push({
            id: id,
            title: title,
            specline: specline,
            price: price,
            imageUrl: imageUrl,
            priceAlert: false,
            alertPrice: 0,
            selected: false,
            checkbox: checkbox,
        });
        //Add an eventlistener to the label button for adding and deleting products
        label.addEventListener('click', () => {
            if (!checkbox.getAttribute('checked')) {
                addToMPO(id, checkbox);
            } else {
                deleteFromMPO(id, checkbox);
            }
        })
    }
}

//HTML for the new popover element
let popoverHTML = `
<div class="wrapper">
<ul class="tabbar">
<li class="tab_select mijnProducten active"><span>Mijn Producten(<span class="counter mpo">${mpoCounter}</span>)</span></li>
<li class="tab_select compare"><span>Vergelijk(<span class="counter compare">${compareCounter}</span>)</span></li>
</ul>
<div class="contentWrapper">
<div class="topInfo">
<span class="topTitle"></span>
<a class="ctaButton top"></a>
</div>
<span class="introText">Je hebt momenteel geen producten toegevoegd. Voeg producten toe om deze in een lijst te zetten, een Prijsalert voor aan te maken of te vergelijken.</span>
<div class="singleProducts">
</div>
<div class="compareProducts">
</div>
<div class="priceAlertsList">
<span class="list-title">Mijn Prijsalerts</span>
<div class="priceAlertContent">
</div>
</div>
<div class="all-lists">
</div>
<div class="bottom-info">
<p style="margin-bottom: 5px; font-size: 12px;"><span class="counter lists">${listCounter}</span> lijsten, met in totaal <span class="counter mpo">${mpoCounter}</span> producten</p>
<p style="margin-bottom: 15px; font-size: 18px; font-weight: bolder;">Meer producten toevoegen?</p>
<a class="ctaButton">Bekijk Pricewatch</a>
</div>
<div class="suggestion-item-wrapper">
</div>
<div class="popUpContent">
<div class="scrollPopUp"">
<span style="margin-left: 10px;"><span style="font-weight: bolder;" class="counter selected">${selectedCounter}</span> producten geselecteerd</span>
<a class="ctaButton newList" style="float: right; margin-right: 10px; margin-top: 11px;">Selectie in lijst plaatsen</a>
</div>
</div>
</div>`;

//Create a new popover and set the styling and innerHTML
let popover = document.createElement('div');
popover.className = 'pop-over';
popover.innerHTML = popoverHTML;

//Append the new popover to the body
let body = document.querySelector('body');
body.appendChild(popover);

//Grab elements in the popover to user in the code
let mpoTab = popover.querySelector('.tab_select.mijnProducten');
let compareTab = popover.querySelector('.tab_select.compare');
let topTitle = popover.querySelector('.topTitle');
let buttonTop = popover.querySelector('.ctaButton.top');
let contentWrapper = popover.querySelector('.contentWrapper');
let singleProducts = popover.querySelector('.singleProducts');
let priceAlertContent = popover.querySelector('.priceAlertContent');
let priceAlertList = popover.querySelector('.priceAlertsList');
let allLists = popover.querySelector('.all-lists');
let introText = popover.querySelector('.introText');
let suggestionItemWrapper = popover.querySelector('.suggestion-item-wrapper');
let compareProducts = popover.querySelector('.compareProducts');
let popUpContent = popover.querySelector('.popUpContent');

//Add event listener to the button in the popover
buttonTop.addEventListener("click", createNewList);

//Event listeners to the tab buttons
mpoTab.addEventListener('click', () => {
    changeState(compareTab);
    changeState(mpoTab);
    switchContent();
});
compareTab.addEventListener('click', () => {
    changeState(compareTab);
    changeState(mpoTab);
    switchContent();
});

//Function to switch the contentview in the popover
function switchContent() {
    if (mpoTab.className === 'tab_select mijnProducten active') {
        topTitle.innerText = 'Mijn Producten';
        buttonTop.innerText = 'Nieuwe lijst maken';
        singleProducts.style.display = 'block';
        priceAlertContent.style.display = 'block';
        allLists.style.display = 'block';
        compareProducts.style.display = 'none';
    } else if (compareTab.className === 'tab_select compare active') {
        topTitle.innerText = 'Vergelijking';
        buttonTop.innerText = 'Vergelijk';
        compareProducts.style.display = 'block';
        singleProducts.style.display = 'none';
        priceAlertContent.style.display = 'none';
        allLists.style.display = 'none';
    } else {
        //nothing
    }
}

//Run all the essential functions once
addCheckbox();
computeMPOProducts();
calcPriceAlerts();
calcLists();
switchContent();
updateCounter();
appendSuggestions();

//Function to change the state of an element to active or inactive
function changeState(elem) {
    if (elem.classList.contains('active')) {
        elem.classList.remove('active');
    } else {
        elem.classList.add('active');
    }
}

//Function that generates the HTML for the product items
function generateItemHTML(product, category){
      //define buttons and parts of the product item
      let checkBtn1 = ``;
      let checkBtn2 = ``;
      let addToListBtn = `<div class='option addList' style="margin-right: 5px;"></div>`;
      let setAlertBtn = `<div class='option setAlert'></div>`;
      let inputField = ``;
      let deleteBtn = `<img src="https://tweakers.net/g/if/icons/delete_product.png" class="delProduct">`;
      //Switch case for manipulating the HTML for the product item
      switch(category){
          case 'singleProduct':
            checkBtn1 = `<label class="compare ctaButton unselected checkbox"><input type="checkbox" name="products[]" value="${product.id}"><span>Vergelijk</span></label>`;
            checkBtn2 = '';
            break;
          case 'priceAlert':
            inputField = `<span class="inputEuro"><input class="text" type="text" size="8" name="" id="" value="${product.alertPrice}"></span>`;
            setAlertBtn = '';
            addToListBtn = '';
            break;
          case 'productCompare':
            checkBtn1 = `<label class="compare ctaButton unselected checkbox"><input type="checkbox" name="products[]" value="${product.id}"><span>Mijn Producten</span></label>`;
            addToListBtn = '';
            break;
          case 'productInList':
            checkBtn1 = `<label class="compare ctaButton unselected checkbox"><input type="checkbox" name="products[]" value="${product.id}"><span>Gekocht</span></label>`;
            checkBtn2 = `<label class="compare ctaButton unselected checkbox"><input type="checkbox" name="products[]" value="${product.id}"><span>Vergelijk</span></label>`;
      }
      //Html for the product in the list 
      let html = `
      <div class='itemWrapper'>
      <div class="itemContentWrapper">
      ${deleteBtn}
      ${inputField}
      <div class="itemOptions">
      ${addToListBtn}
      ${setAlertBtn}
      </div>
      <div class="imageProduct" style='background-image: url("${product.imageUrl}");'></div>
      <div class='itemInfo'>
      <ul>
      <li class='titleProduct'><span><a>${product.title}</a></span></li>
      <li class='speclineProduct'><span><a style="color: #666666;">${product.specline}</a></span></li>
      <li  class='priceProduct'><span><a>${product.price}</a></span></li>
      </ul>
      </div>
      </div>
      <div class="item-options-bottom" style="text-align: right; margin-right: 10px; margin-top: 5px;">
      ${checkBtn1}
      ${checkBtn2}
      </div>
      </div>
      `;
      //Return all the buttons and clickable parts
      return html;
}


//Function to add some suggestions to the view
function appendSuggestions() {
    //Add a 4 suggestion items to the wrapper
    for (i = 0; i < 4; i++) {
        //Calculate a random number
        let randomNumber = Math.floor((Math.random() * 25) + 1);
        //Create a div for the suggestion item
        let suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        //Get ID and label
        let id = productsOnPage[randomNumber].id;
        let checkbox = productsOnPage[randomNumber].checkbox;
        //HTML for the suggestion item
        let html = `
        <div class="suggestion-item-content">
        <button class="addItem"></button>
        <div class="suggestion-item-info">
        <p style="max-width: 115px; margin-bottom: 5px; color: #1668AC">${productsOnPage[randomNumber].title}</p>
        <p style="max-width: 100px; color: #666666; font-size: 12px;">${productsOnPage[randomNumber].specline}</p>
        </div>
        </div>
        `;
        //Set the HTML as innerHTML
        suggestionItem.innerHTML = html;
        //Set a background image for the item
        suggestionItem.style.backgroundImage = `url("${productsOnPage[randomNumber].imageUrl}")`;
        suggestionItemWrapper.appendChild(suggestionItem);
        //Eventlistener for the add button in the item
        let addButton = suggestionItem.querySelector('.addItem');
        addButton.addEventListener('click', () => {
            if (addButton.className === 'addItem') {
                changeState(addButton);
                addToMPO(id, checkbox);
            } else {
                changeState(addButton);
                deleteFromMPO(id, checkbox);
            }
        })
    }
}

//Function that adds products to the MPO array
function addToMPO(id, checkbox) {
    //Select the product that needs to be added
    let product = productsOnPage.filter(product => product.id === id)[0];
    productsMPO.push(product);
    computeMPOProducts();
    updateCounter();
    //Set the label for that product to checked
    checkbox.setAttribute('checked', 'true')
}

//Function that removes the product from the MPO array
function deleteFromMPO(id, checkbox) {
    //Select the product that needs to be removed
    let product = productsMPO.filter(item => item.id === id)[0];
    //Search for the index of the product in the array
    let index = productsMPO.indexOf(product)
    //Remove product
    productsMPO.splice(index, 1)
    computeMPOProducts();
    updateCounter();
    //Remove the checked attribute on the checkbox
    checkbox.removeAttribute('checked');
}

//Function to add all the products in the MPO array to the view
function computeMPOProducts() {
    //Remove all the HTML from the single products view
    singleProducts.innerHTML = '';
    //Append all the items in the array to the view
    for (i = 0; i < productsMPO.length; i++) {
        //Define the properties of the item
        let id = productsMPO[i].id;
        let checkbox = productsOnPage[i].checkbox;
        //Create new item element
        let productItem = document.createElement('div');
        //Set the attribute id to the productID and style the element
        productItem.setAttribute('id', id);
        productItem.className = 'productItem';
        //Set the innerHTML for the item to the itemHTML and append it to the contentview
        productItem.innerHTML = generateItemHTML(productsMPO[i], 'singleProduct');
        singleProducts.appendChild(productItem);
        //Define all the buttons of the product item
        let deleteBtn = productItem.querySelector('.delProduct');
        let priceAlertBtn = productItem.querySelector('.setAlert');
        let addListBtn = productItem.querySelector('.addList');
        let addCompare = productItem.querySelector('.compare');
        //Eventlistener for deleting a product from the list
        deleteBtn.addEventListener('click', () => {
            deleteFromMPO(id, checkbox);
        })
        //Eventlistener for setting a price alert for the product
        priceAlertBtn.addEventListener('click', () => {
            if (priceAlertBtn.className == 'option setAlert') {
                setPriceAlert(id, priceAlertBtn);
            } else {
                deletePriceAlert(id)
            }
        })
        //Eventlistener for adding the product to a list
        addListBtn.addEventListener('click', () => {
            if (addListBtn.className === 'option addList') {
                selectProducts(id);
                changeState(addListBtn)
            } else {
                changeState(addListBtn);
            }
        })
        //Event listener for adding the product to a list
        addCompare.addEventListener('click', () => {
            if (addCompare.className === 'compare ctaButton unselected checkbox') {
                addToCompare(id);
                addCompare.className = 'compare ctaButton selected checkbox'
            } else {
                addCompare.className = 'compare ctaButton unselected checkbox'
            }
        })
    }
}
//Function for adding products to the content listview
function addToCompare(id) {
    //Select the product that needs to be added
    let product = productsOnPage.filter(product => product.id === id)[0];
    //Push to the array and append all the products in that array to the view
    productsCompare.push(product);
    calcCompareProducts();
    updateCounter();
}
//Function the add all the products in the compare array to the view
function calcCompareProducts() {
    //Set innerhtml for the compareview to empty
    compareProducts.innerHTML = '';
    for (i = 0; i < productsCompare.length; i++) {
        //Grab the id from the product
        let id = productsMPO[i].id;
        //Create new div for the product item
        let productItem = document.createElement('div');
        //Set the attribute id to the id and give it a classname
        productItem.setAttribute('id', id);
        productItem.className = 'productItem';
        //Set the innerHTML for the item to the itemHTML and append it to the contentview
        productItem.innerHTML = generateItemHTML(productsMPO[i], 'compareProduct');
        compareProducts.appendChild(productItem);
        //Grab all the buttons in the product item
        let deletebtn = productItem.querySelector('.delProduct');
        let priceAlertBtn = productItem.querySelector('.setAlert');
        //Add eventlistener to the delete button
        deletebtn.addEventListener('click', () => {
            deleteFromMPO(id, label);
        })
        //Eventlistener for setting a price alert for the product
        priceAlertBtn.addEventListener('click', () => {
            if (priceAlertBtn.className == 'option setAlert') {
                setPriceAlert(id, priceAlertBtn);
            } else {
                deletePriceAlert(id)
            }
        })
    }
}

//Function for setting a price alert
function setPriceAlert(id, alertBtn) {
    let product = productsMPO.filter(product => product.id === id)[0];
    let notification = createNotification('prijsalert', id);
    //If the users submits, the price alert will be set
    let submitButton = notification.querySelector('.ctaButton');
    submitButton.addEventListener('click', () => {
        product.priceAlert = true;
        let value = notification.querySelector('input').value;
        product.alertPrice = value;
        //Push the product to the price alerts array
        allPriceAlerts.push(product);
        changeState(alertBtn)
        calcPriceAlerts();
        closePopup(notification);
    })
}

//Function to delete a price alert
function deletePriceAlert(id) {
    //Search for the product 
    let product = productsMPO.filter(product => product.id === id)[0];
    try {
        //Search for the alert button 
        let alertBtn = Array.from(singleProducts.querySelectorAll('.productItem')).filter(alert => alert.getAttribute('id') === id)[0];
        alertBtn = alertBtn.querySelector('.setAlert');
        changeState(alertBtn);
        //Set price alert to false
        product.priceAlert = false;
    } catch {
        //error
    }
    let index = allPriceAlerts.indexOf(product)
    allPriceAlerts.splice(index, 1)
    calcPriceAlerts();
}

//Function the calculates all the price alerts in the price alert array
function calcPriceAlerts() {
    // If/else for displaying the price alert wrapper in the popover
    if (allPriceAlerts.length < 1) {
        priceAlertList.style.display = 'none';
    }else {
        priceAlertList.style.display = 'block';
        priceAlertContent.innerHTML = '';
        for (i = 0; i < allPriceAlerts.length; i++) {
            let id = allPriceAlerts[i].id;
            //Create new element for the price alert item
            let priceAlertItem = document.createElement('div');
            priceAlertItem.className = 'price-alert-item';
            //Set the innerhtml and append it to the view
            priceAlertItem.innerHTML = generateItemHTML(allPriceAlerts[i], 'priceAlert');
            priceAlertContent.appendChild(priceAlertItem);
            //Eventlistener for the delete button
            let deleteBtn = priceAlertItem.querySelector('.delProduct');
            deleteBtn.addEventListener('click', () => {
                deletePriceAlert(id);
            });
        }
    }
}

//Function to generate the pop up notification to the view
function createNotification(category, id = null) {
    //Variables in the popup notification
    let popUpTitle;
    let popUpMessage;
    let inputFieldSize;
    let popUpBtnTitle;
    let inputField;
    let ul;
    //Create new element and set classname
    let popupNotification = document.createElement('div');
    popupNotification.className = 'popup-notification';
    //Select the product 
    let product = productsOnPage.filter(product => product.id === id)[0];
    if (category === 'prijsalert') {
    popUpTitle = 'Prijsalert instellen';
    inputFieldSize = '10';
    popUpBtnTitle = 'Prijsalert instellen';
    popUpMessage = `Je gaat een prijsalert instellen voor <span style="font-weight: bolder">${product.title}</span>`;
    inputField = `<span style="width: 80%;" class="inputEuro"><input  class="text" type="text" size="${inputFieldSize}" name="product" id="" value=""></span>`;
    ul = '';
    }else if (category === 'newlist') {
    popUpTitle = 'Nieuwe lijst maken';
    inputFieldSize = '30';
    popUpBtnTitle = 'Nieuwe lijst aanmaken';
    popUpMessage = 'Typ de naam van de nieuwe lijst';
    inputField = `<span style="width: 80%;" class="inputEuro"><input  class="text" type="text" size="${inputFieldSize}" name="product" id="" value=""></span>`;
    ul = '';
    }else if (category === 'addToList') {
    popUpTitle = 'Selecteer een lijst';
    inputFieldSize = '0';
    popUpBtnTitle = 'Toevoegen';
    popUpMessage = 'Selecteer de lijsten waaraan je deze producten wilt toevoegen of maak een nieuwe lijst aan';
    inputField = ``;
    ul = `<ul class="lists-popup" style="list-style-type: none">${appendLists()}</ul>`
    //Function to append the lists to the popup notification
    function appendLists(){
        return `${lists.map(function (list) {
            return `<li>
            <span style="font-weight: bolder; font-size: 14px">${list.name}</span>
            <br>
            <span style="font-weight: lighter; font-size: 11px;">${list.products.length} producten in lijst</span>
            <button class="addItem" list-id="${list.id}"></button>
            </li>`;
        })}
        ` 
    }
    }
    //Set the html and append it to the item
    let html = `
    <div class="popup-notificationWrapper">
    <div class="textArea">
    <p class="pop-upTitle">${popUpTitle}</p>
    <span class="bodyText">${popUpMessage}</span>
    <br>
    ${inputField}
    ${ul}
    <a class="popup-closeBtn" style="bottom: 15px; right: 15px; position: absolute;">Sluiten(x)</a>
    <a style="margin-top: 15px;" class="ctaButton">${popUpBtnTitle}</a>
    </div>
    </div>
    `;
    popupNotification.innerHTML = html;
    popUpContent.appendChild(popupNotification);
    //Eventlistener for closing the button
    let closeBtn = popupNotification.querySelector('.popup-closeBtn');
    closeBtn.addEventListener('click', () =>{
        closePopup(popupNotification);
    });
    return popupNotification;
}

//Function to close the popup
function closePopup(popup){
    popUpContent.removeChild(popup);
}

//Function to append the lists to the view
function calcLists() {
    //Empty the innerhtml of the listview
    allLists.innerHTML = '';
    //Append each list in the list array
    for (i = 0; i < lists.length; i++) {
        let id = lists[i].id;
        //Html for the list
        let html = `
        <div class="list-options-top" style="width: auto;">
        <span class="list-title">${lists[i].name}<span> (${lists[i].products.length})</span></span>
        <button class="option share" style="margin-right: 10px;"></button>
        <button class="option collapse" style="margin-right: 5px;"></button>
        </div>
        <div class='list-content active'>
        </div>
        <div class="list-options-bottom">
        <button class="ctaButton secondary">Totaal berekenen</button>
        <button class="ctaButton secondary">Verwijder lijst</button>
        </div>
        `
        //Create new element for the list, set the classname and append it to the view
        let list = document.createElement('div');
        list.className = 'list-wrapper';
        list.setAttribute('list-id', id);
        list.innerHTML = html;
        allLists.appendChild(list);
        //Grab buttons from the list
        let collapseBtn = list.querySelector('.collapse');
        let listContent = list.querySelector('.list-content.active');
        //Add eventlistener to the collapse button
        collapseBtn.addEventListener('click', () => {
            changeState(listContent)
            if (listContent.className === 'list-content') {
                collapseBtn.style.transform = 'rotate(-180deg)';
            } else {
                collapseBtn.style.transform = 'rotate(0deg)';
            }
        })
        //Add all the products in that particular list to the view
        let products = lists[i].products;
        if (products.length > 0) {
            for (i = 0; i < products.length; i++) {
                //Create a element for the product item
                let productInList = document.createElement('div');
                productInList.innerHTML = generateItemHTML(products[i], 'productInList');
                productInList.style.marginTop = '10px';
                listContent.appendChild(productInList);
                listContent.firstElementChild.style.marginTop = '0px';
            }
        } else {
            //nothing
        }
    }
}

//Function for creating a new list
function createNewList() {
    //Create notification
    let notification = createNotification('newlist');
    //If the user submits the notification the list is being added to the list array
    let submitButton = notification.querySelector('.ctaButton');
    let id = Math.floor((Math.random() * 11000) + 22000);
    submitButton.addEventListener('click', () => {
        let listName = notification.querySelector('input').value;
        lists.push({
            id: id,
            name: listName,
            products: [],
        });
        closePopup(notification);
        calcLists();
        updateCounter();
    })
}

//Function to select products
function selectProducts(id) {
    let product = productsMPO.filter(product => product.id === id)[0];
    product.selected = true;
    buttonTop.innerText = 'Selectie in lijst plaatsen';
    buttonTop.removeEventListener('click', createNewList);
    let scrollableBtn = popover.querySelector('.scrollPopUp').querySelector('.ctaButton');
    scrollableBtn.addEventListener('click', addToList);
    buttonTop.addEventListener('click', addToList);
    updateCounter();
} 

//Function for adding products to a list
function addToList(productID) {
    //Create notification
    let notification = createNotification('addToList', productID)
    let buttons = notification.querySelectorAll('.addItem');
    for (i = 0; i < buttons.length; i++) {
        let listID = buttons[i].getAttribute('list-id');
        buttons[i].addEventListener('click', () => {
            let selectedProducts = Array.from(productsMPO.filter(item => item.selected === true));
            let selectedList = lists.filter(item => item.id == listID);
            for (i = 0; i < selectedProducts.length; i++) {
                selectedList[0].products.push(selectedProducts[i]);
            }
            closePopup(notification);
            calcLists();
        })
    }
}

contentWrapper.addEventListener('scroll', () => {
    let scrollPosition = contentWrapper.scrollTop;
    let scrollPopUp = popover.querySelector('.popUpContent').querySelector('.scrollPopUp');

    if (buttonTop.innerText == 'Selectie in lijst plaatsen') {
        if (scrollPosition > 55) {
            scrollPopUp.style.display = 'block';
        } else {
            scrollPopUp.style.display = 'none';
        }
    } else {
        //nothing
    }
})

//Function for updating the counter
function updateCounter() {
    mpoCounter = productsMPO.length + allPriceAlerts.length;
    compareCounter = productsCompare.length;
    listCounter = lists.length;
    selectedCounter = Array.from(productsMPO.filter(item => item.selected === true)).length;
    //Grab all the counters on the page
    let counters = popover.querySelectorAll('.counter');
    for (i = 0; i < counters.length; i++) {
        let className = counters[i].className;
        if (className === 'counter mpo') {
            counters[i].innerHTML = '';
            counters[i].innerHTML = mpoCounter;
        } else if (className === 'counter lists') {
            counters[i].innerHTML = '';
            counters[i].innerHTML = listCounter;
        } else if (className === 'counter selected') {
            counters[i].innerHTML = '';
            counters[i].innerHTML = selectedCounter;
        } else if (className === 'counter compare') {
            counters[i].innerHTML = '';
            counters[i].innerHTML = compareCounter;
        }
    }
    //Toggle the introtext and the suggestion items
    if (mpoCounter > 0 || listCounter > 0) {
        introText.style.display = 'none';
        suggestionItemWrapper.style.display = 'none';
    }else{
        introText.style.display = 'block';
        suggestionItemWrapper.style.display = 'block';
    }
}

//Make the element draggable only on desktop
//if(window.innerWidth > 767){
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
//}else{
    //nothing
//}

//Adding css to the javascript code
let head = document.querySelector('head');
let style = document.createElement('style');

style.innerHTML = `
.iconMPO a{
    display: block;
    height: 44px;
    position: relative;
    width: 31px;
    background-image: url("data:image/svg+xml,%3Csvg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0H16.4138V17H0V0ZM2.05172 2.34483H5.12931V4.10345H2.05172V2.34483ZM14.3621 2.34483H7.18103V4.10345H14.3621V2.34483ZM2.05172 5.86207H5.12931V7.62069H2.05172V5.86207ZM14.3621 5.86207H7.18103V7.62069H14.3621V5.86207ZM2.05172 9.37931H5.12931V11.1379H2.05172V9.37931ZM14.3621 9.37931H7.18103V11.1379H14.3621V9.37931ZM2.05172 12.8966H5.12931V14.6552H2.05172V12.8966ZM14.3621 12.8966H7.18103V14.6552H14.3621V12.8966Z' fill='%23D9D9D9'/%3E%3C/svg%3E%0A");
    background-position: center center;
    background-size: fit;
    background-repeat: no-repeat;
}
.iconMPO.active a{
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0H16.4138V17H0V0ZM2.05172 2.34483H5.12931V4.10345H2.05172V2.34483ZM14.3621 2.34483H7.18103V4.10345H14.3621V2.34483ZM2.05172 5.86207H5.12931V7.62069H2.05172V5.86207ZM14.3621 5.86207H7.18103V7.62069H14.3621V5.86207ZM2.05172 9.37931H5.12931V11.1379H2.05172V9.37931ZM14.3621 9.37931H7.18103V11.1379H14.3621V9.37931ZM2.05172 12.8966H5.12931V14.6552H2.05172V12.8966ZM14.3621 12.8966H7.18103V14.6552H14.3621V12.8966Z' fill='black'/%3E%3C/svg%3E%0A");
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
    border-top: none;
}

.tabbar li{
    width: 49.8%;
    border: none;
    float: left;
    color: black;
    font-size: 12px;
    height: 100%;
    border: 1px #D9D9D9 solid;
    background-image: linear-gradient(#fff, #f2f2f2);
    border-bottom: none;
    text-align: center;
}

.tabbar li span{
    line-height: 30px;
}

.tabbar{
    list-style-type: none;
    height: 30px;
    width: 100%;
    margin: 0px;
    padding: 0px;

}

.tabbar :last-child{
    border-left: none;
    border-right: none;
}

.tabbar :first-child{
    border-left: none;
}

.tab_select.active{
    color: #b9133d;
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
.contentWrapper.compareProducts{
    height: auto;
    display: none;
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

.suggestion-item-info{
    text-align: left; 
    background-color: white; 
    margin-left: 5px; 
    height: auto;
    margin-top: 87px; 
}

.suggestion-item-info p{
    font-size: 14px;
    height: 14px;
    word-wrap: break-word; 
    overflow: hidden; 
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

.itemContentWrapper{
    height: 80px;
    margin: 0 auto;
    width: 95%;
    left: 0;
    right: 0;
    background-color: #E5E5E5;
    border-radius: 2px;
    position: relative;
    
}

.itemContentWrapper ul{
    list-style-type: none;
    margin-left: 50px;
    padding-top: 10px;
    margin-top: 0px;
}

.itemWrapper{
    height: auto;
}

.list-content :first-child{
    margin-top: 0px;
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

.delProduct{
    float: right; 
    margin: 2px;
}

.productItem{
    margin-bottom: 20px;
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
    width: auto;
}

.priceAlertsBlock{
    display: none;
}

.price-alert-item .inputEuro{
    right: 5px;  
    bottom: 5px; 
    position: absolute;
}

/* width */
.contentWrapper::-webkit-scrollbar {
  width: 4px;
  overflow: overlay;
  position: absolute;
  z-index: 100;
}

/* Track */
.contentWrapper::-webkit-scrollbar-track {
  background: #f1f1f1; 
  overflow: overlay;
  position: absolute;
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

.list-wrapper .option{
    height: 20px; 
    width: 20px;
    float:right;
}


.itemOptions{
    right: 5px;
    bottom: 5px;
    position: absolute;
    float: right; 
    margin-right: 0px;
}

.itemOptions .option{
    background-color: #D9D9D9;
    background-position: center center;
    background-size: contain; 
    background-repeat: no-repeat;
    background-size: 16px;
    border-radius: 2px;
    height: 35px;
    width: 35px;
    float: left;
}


.item-options-bottom{
    text-align: right; 
    margin-right: 10px; 
    margin-top: 5px;
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
    height: auto;
    width: 100%;
    top: 0;
}

.pop-upTitle{
    font-size: 16px;
    font-weight: bolder;
    margin-bottom: 5px;
}

.textArea{
    height: auto;
    padding: 15px;
}

.list-wrapper{
    margin-bottom: 40px;
}



.list-content{
    display: none;
    background-color: #D9D9D9; 
    max-width: 95%; 
    height: auto; 
    margin: 0 auto; 
    margin-top: 15px; 
    padding-bottom: 10px; 
    padding-top: 10px;

}

.list-content.active{
    display: block;
}


.list-options-top button{
    background-color: #1668AC;
    border-radius: 2px;
    border: none;
    background-size: 11px;
    background-position: center center;
    background-repeat: no-repeat;
}

.list-options-bottom{
    width: 95%; 
    margin: 0 auto; 
    margin-top: 10px;
}

.list-options-bottom button{
    float: right;
}

.collapse{
    background-image: url('data:image/svg+xml, %3Csvg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M5.53176 0.666452L0.191706 6.0066C0.068097 6.13011 0 6.29499 0 6.4708C0 6.6466 0.068097 6.81148 0.191706 6.93499L0.584873 7.32825C0.841066 7.58415 1.25745 7.58415 1.51326 7.32825L5.99751 2.844L10.4867 7.33323C10.6104 7.45674 10.7751 7.52493 10.9508 7.52493C11.1267 7.52493 11.2915 7.45674 11.4152 7.33323L11.8083 6.93996C11.9319 6.81635 12 6.65157 12 6.47577C12 6.29997 11.9319 6.13509 11.8083 6.01158L6.46336 0.666452C6.33936 0.542648 6.1738 0.474648 5.99781 0.475039C5.82112 0.474648 5.65566 0.542648 5.53176 0.666452Z" fill="white"/%3E%3C/svg%3E');
}
.share{
    background-image: url('data:image/svg+xml, %3Csvg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M4.44473 3.00859C3.03077 4.47153 3.33933 6.89934 4.95899 7.97483C5.01236 8.01028 5.08336 8.00325 5.1292 7.95846C5.47018 7.62529 5.75864 7.30257 6.01122 6.89214C6.04987 6.82935 6.02583 6.74786 5.961 6.71274C5.71395 6.5789 5.46812 6.32793 5.32973 6.06283L5.32957 6.06293C5.16379 5.73282 5.10735 5.36279 5.19512 4.98064C5.19521 4.98066 5.1953 4.98068 5.1954 4.98068C5.29639 4.49142 5.82165 4.03629 6.22282 3.61538C6.22197 3.6151 6.22115 3.61479 6.22031 3.61451L7.7234 2.0804C8.3224 1.46904 9.30768 1.464 9.9129 2.06922C10.5242 2.6682 10.5343 3.65845 9.93536 4.26979L9.02492 5.20602C8.98279 5.24935 8.96912 5.31257 8.98884 5.36971C9.19846 5.9776 9.25002 6.83474 9.10955 7.48233C9.10561 7.50045 9.12798 7.51232 9.14094 7.49907L11.0786 5.52137C12.3165 4.25799 12.306 2.20104 11.0553 0.950372C9.77896 -0.325972 7.70112 -0.31535 6.43788 0.973937L4.4525 3.00029C4.44987 3.00306 4.44738 3.00587 4.44473 3.00859Z" fill="white"/%3E%3Cpath d="M8.06699 8.25341C8.06697 8.25348 8.06692 8.25355 8.0669 8.25362C8.06814 8.25311 8.06929 8.25261 8.07053 8.25207C8.46598 7.52896 8.54383 6.69963 8.35849 5.89117L8.35765 5.89203L8.35674 5.89164C8.18076 5.17157 7.6979 4.45655 7.0421 4.01631C6.98569 3.97844 6.89558 3.98283 6.84275 4.02555C6.51056 4.29415 6.18541 4.63857 5.97086 5.07811C5.93716 5.14711 5.96239 5.23 6.0288 5.26855C6.27779 5.41311 6.50266 5.62475 6.65322 5.90573L6.65345 5.90556C6.77078 6.10405 6.88641 6.48067 6.81151 6.88534C6.81147 6.88534 6.8114 6.88534 6.81135 6.88534C6.74148 7.42185 6.19969 7.91398 5.76899 8.35743L5.7692 8.35764C5.44135 8.6929 4.60794 9.54251 4.27423 9.88344C3.67525 10.4948 2.685 10.5049 2.07366 9.90591C1.46232 9.30693 1.45222 8.31667 2.0512 7.70534L2.96433 6.76629C3.00572 6.72373 3.01979 6.66188 3.00138 6.60544C2.79863 5.98334 2.74308 5.14552 2.87106 4.49866C2.87462 4.48063 2.85244 4.46912 2.83957 4.48225L0.931017 6.43019C-0.319512 7.70653 -0.308913 9.78459 0.954605 11.0481C2.23088 12.2986 4.29822 12.2774 5.5487 11.0012C5.98312 10.5152 7.84273 8.79346 8.06699 8.25341Z" fill="white"/%3E%3C/svg%3E');

}





/* popup notifications */

.popUpContent{
    border-bottom: 1px #D9D9D9 solid;
    height: auto; 
    width: 100%; 
    background-color: #f2f2f2; 
    top: 30px; 
    position: absolute; 
    left: 0; 
    right: 0; 
    border-radius: 2px;
}
.popup-notification ul{
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 300px;
    height: auto;
    margin-left: 0px;
    padding-left: 0px;
    margin-bottom: 0px;
}
.popup-notification ul li{
    max-height: 50px;
    background-color: white;
    margin-bottom: 5px;
    padding: 10px;
    border-radius: 2px;
    position: relative

}
.popup-notification ul li button{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 10px;
    margin-top: 13px;
}
.popup-notification .bodyText{
    margin-bottom: 5px;
}

.scrollPopUp{
    display:none;
    height: 50px; 
    line-height: 50px;
}

.priceAlertsList{
    margin-top: 40px;
}

/*Responsive css*/
@media only screen and (max-width: 767px) {
    .contentWrapper{
        height: 90vh;
        width: 100vw;
    }
    .pop-over{
        left: 0px;
        right: 0px;
        bottom: 0;
    }

    .iconMPO{
        width: 44px;
    }
  }
`
head.appendChild(style);