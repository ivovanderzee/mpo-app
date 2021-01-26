//Grab all the list items on a pricewatch page
let pricewatchItems = document.querySelector('.listing.useVisitedState').querySelectorAll('.largethumb');

//Toggle to turn off/on the checkboxes in the pricewatch listing
let vergelijkCheckboxes = true;
let mijnProductenCheckboxes = true;

//JSON data arrays used in the code
let allProducts = [];
let singleProducts = [];
let productsCompare = [];
let allPriceAlerts = [];
let lists = [];

//Counting items/products in the different arrays
let mpoCounter = singleProducts.length + allPriceAlerts.length;
let compareCounter = productsCompare.length;
let listCounter = lists.length;
let selectedCounter = Array.from(singleProducts.filter(item => item.selected === true)).length;
let productsInListCounter = 0;

//Search compare icon content and add a eventlistener to it
let iconCompare = document.querySelector('.icon.compare');
let iconFlag = document.querySelector('.icon.display.flag');
let userbar = document.querySelector('#userbar');

//Create new icon and place it in the header, delete the old icon
let iconMPO = document.createElement('li');
iconMPO.className = 'iconMPO';
let iconMPOHTML = `<a></a><span class="counter mpo compare">${mpoCounter + compareCounter}</span>`;
iconMPO.innerHTML = iconMPOHTML;
userbar.removeChild(iconCompare);
userbar.insertBefore(iconMPO, iconFlag);

//Add event listener for the icon in the header to display the popover based on the state of the icon
iconMPO.addEventListener('click', () => {
    iconMPO.classList.remove('new');
    changeState(iconMPO);
    if (iconMPO.classList.contains('active')) {
        popover.style.display = 'block';
    } else {
        popover.style.display = 'none';
    }
});

//Function to grab all the data and push it to the array
function getData() {
    for (i = 0; i < pricewatchItems.length; i++) {

        //Specify some properties from each product
        let id = pricewatchItems[i].querySelector('input').getAttribute('value');
        let title = pricewatchItems[i].querySelector('.itemname').querySelector('.ellipsis').querySelector('a').innerText;
        let specline = pricewatchItems[i].querySelector('.itemname').querySelector('.specline.ellipsis').querySelector('a').innerText;
        let price = pricewatchItems[i].querySelector('.price').querySelector('a').innerText;
        let imageUrl = pricewatchItems[i].querySelector('.pwimage').querySelector('a').querySelector('img').getAttribute('src');

        //Push the properties to a JSON file
        allProducts.push({
            id: id,
            title: title,
            specline: specline,
            price: price,
            imageUrl: imageUrl,
            priceAlert: false,
            alertPrice: 0,
            selected: false,
            compared: false,
            bought: false,
            boughtPrice: 0
        });
    }
}

//Function to add a checkbox to all products on a Pricewatch page
function addCheckbox() {
    //Add the checkbox the to all the products in the list on a pricewatch page
    for (i = 0; i < pricewatchItems.length; i++) {

        //Define some properties and variables and remove old label
        let itemName = pricewatchItems[i].querySelector('.itemname');
        let compareLabel = pricewatchItems[i].querySelector('label');
        let product = allProducts.filter(product => product.id === allProducts[i].id)[0];
        itemName.removeChild(compareLabel);

        //Add checkboxes Mijn Producten
        if (mijnProductenCheckboxes) {
            //Create a new label and set the innerHTML of the checkbox(es)
            let mijnProductenLabel = document.createElement('label');
            mijnProductenLabel.classList.add(`mijn-producten-label${product.id}`);
            mijnProductenLabel.innerHTML = `<input type="checkbox" name="products[] value="${product.id}""><span>Mijn Producten</span>`;
            let checkbox1 = mijnProductenLabel.querySelector('input')
            itemName.appendChild(mijnProductenLabel);
            //Add an eventlistener to the label button
            mijnProductenLabel.addEventListener('click', () => {
                if (!checkbox1.classList.contains('added')) {
                    addToMPO(product);
                    topNotification(product);
                    checkbox1.classList.add('added');
                } else {
                    deleteFromMPO(product);
                    checkbox1.classList.remove('added');
                }
            })
        } else {
            //nothing
        }

        //Add checkbox vergelijk
        if (vergelijkCheckboxes) {
            let vergelijkLabel = document.createElement('label');
            vergelijkLabel.classList.add(`vergelijk-label${product.id}`);
            vergelijkLabel.style.marginLeft = '5px';
            vergelijkLabel.innerHTML = `<input type="checkbox" name="products[] value="${product.id}""><span>Vergelijk</span>`;
            let checkbox2 = vergelijkLabel.querySelector('input');
            itemName.appendChild(vergelijkLabel);

            //Add an eventlistener to the label button
            vergelijkLabel.addEventListener('click', () => {
                if (!checkbox2.classList.contains('added')) {
                    addToCompare(product);
                    checkbox2.classList.add('added');
                } else {
                    deleteFromCompare(product);
                    checkbox2.classList.remove('added');
                }
            });
        } else {
            //nothing
        }
    }
}

//HTML for the new popover element
let popoverHTML = `
<div class="wrapper">
<div id="dragBar"><span class="close-popover">X</span><span class="dragIcon"></span></div>
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
<div class="priceAlertsList">
<span class="list-title">Mijn Prijsalerts</span>
<button class="option collapse" style="margin-right: 5px;"></button>
<div class="priceAlertContent">
</div>
</div>
<div class="singleProducts">
</div>
<div class="compareProducts">
</div>
<div class="all-lists">
</div>
<div class="bottom-info">
<p class="bottomCta" style="margin-bottom: 5px; font-size: 12px;"><span class="counter lists">${listCounter}</span> lijsten, met in totaal <span class="counter mpo">${mpoCounter}</span> producten</p>
<p style="margin-bottom: 15px; font-size: 18px; font-weight: bolder;">Meer producten toevoegen?</p>
<a class="ctaButton">Bekijk Pricewatch</a>
</div>
<div class="suggestion-item-wrapper">
</div>
</div>
<div class="popUpContent">
<div class="addListPopup"">
<span style="margin-left: 10px;"><span style="font-weight: bolder;" class="counter selected">${selectedCounter}</span> producten geselecteerd</span>
<a class="ctaButton newList" style="float: right; margin-right: 10px; margin-top: 18px;">Selectie in lijst plaatsen</a>
</div>
</div>
</div>
`;

//Create a new popover and set the styling and innerHTML
let popover = document.createElement('div');
popover.className = 'pop-over';
popover.innerHTML = popoverHTML;
popover.style.display = 'none';

//Append the new popover to the body
let body = document.body;
document.body.appendChild(popover);

//Grab elements in the popover
let tabs = popover.querySelectorAll('.tab_select');
let mpoTab = popover.querySelector('.mijnProducten');
let compareTab = popover.querySelector('.compare');
let topTitle = popover.querySelector('.topTitle');
let buttonTop = popover.querySelector('.ctaButton.top');
let contentWrapper = popover.querySelector('.contentWrapper');
let singleProductsContent = popover.querySelector('.singleProducts');
let priceAlertContent = popover.querySelector('.priceAlertContent');
let priceAlertList = popover.querySelector('.priceAlertsList');
let collapsePriceAlerts = priceAlertList.querySelector('.collapse');
let allLists = popover.querySelector('.all-lists');
let introText = popover.querySelector('.introText');
let suggestionItemWrapper = popover.querySelector('.suggestion-item-wrapper');
let compareProducts = popover.querySelector('.compareProducts');
let popUpContent = popover.querySelector('.popUpContent');
let closeButton = popover.querySelector('.close-popover');
let topInfo = popover.querySelector('.topInfo');
let addToListPopup = popover.querySelector('.popUpContent').querySelector('.addListPopup');
let addToListPopupBtn = popover.querySelector('.addListPopup').querySelector('.ctaButton');
let bottomCta = popover.querySelector('.bottomCta');

//Event listener for the add to list button
addToListPopupBtn.addEventListener('click', addToList);

//Add event listener to the button in the popover
buttonTop.addEventListener("click", createNewList);
//Add event listener to the tabs in the popover
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        changeState(tab);
        switchContent(tab);
    });
});

closeButton.addEventListener('click', () => {
    iconMPO.classList.remove('active');
    popover.style.display = 'none';
});

//Function to switch the contentview in the popover
function switchContent(tab) {
    if (tab.classList.contains('mijnProducten')) {
        compareTab.classList.remove('active');
        topTitle.innerText = 'Mijn Producten';
        calcPriceAlerts();
        buttonTop.innerText = 'Nieuwe lijst maken';
        singleProductsContent.style.display = 'block';
        allLists.style.display = 'block';
        compareProducts.style.display = 'none';
        bottomCta.innerHTML = `<span class="counter lists">${listCounter}</span> lijsten, met in totaal <span class="counter mpo">${mpoCounter}</span> producten`;
        bottomCta.removeEventListener('click', emptyCompare)
    } else if (tab.classList.contains('compare')) {
        mpoTab.classList.remove('active');
        topTitle.innerText = 'Vergelijking';
        buttonTop.innerText = 'Vergelijk';
        compareProducts.style.display = 'block';
        singleProductsContent.style.display = 'none';
        allLists.style.display = 'none';
        priceAlertList.style.display = 'none';
        bottomCta.innerHTML = `<a style="color: #1668ac">Vergelijking leegmaken</a>`;
        bottomCta.addEventListener('click', emptyCompare);
    } else {
        //nothing
    }
}

//Run all the essential functions once
getData();
computeMPOProducts();
calcPriceAlerts();
calcLists();
updateCounter();
switchContent(mpoTab);
appendSuggestions();
addCheckbox();

//Function to change the state of an element to active or inactive
function changeState(elem) {
    if (elem.classList.contains('active')) {
        elem.classList.remove('active');
    } else if (!elem.classList.contains('active')) {
        elem.classList.add('active');
    }
}

//Function to display a notification when a product is added to 'Mijn Producten'
function topNotification(product) {
    let notification = document.createElement('div');
    notification.className = 'top-notification';
    notification.innerHTML = `<span>Je hebt <a style="font-weight: bolder">${product.title}</a> toegevoegd aan Mijn Producten</span>`;
    body.appendChild(notification);
    setTimeout(function () {
        body.removeChild(notification);
    }, 2500)
}

//Function that generates the HTML for the product items
function generateItemHTML(product, category) {
    //define buttons and parts of the product item
    let addToListBtn = `<div title="Product aan lijst toevoegen" class='${product.selected ? 'option addList active' : 'option addList'}' style="margin-right: 5px;"></div>`;
    let setAlertBtn = `<div title="Prijsalert instellen" class='${product.priceAlert ? 'option setAlert active' : 'option setAlert'}' id="${product.id}"></div>`;
    let addCompareBtn = `<div title="Aan vergelijking toevoegen" class='${product.compared ? 'option addCompare active' : 'option addCompare'}' style="margin-right: 5px;" id="${product.id}">Vergelijk</div>`;
    let setBoughtBtn = ``;
    let inputField = ``;
    let deleteBtn = `<img title="Product verwijderen" src="https://tweakers.net/g/if/icons/delete_product.png" class="delProduct">`;
    let boughtPrice = ``;

    //Switch case for manipulating the HTML for the product item
    switch (category) {
        case 'singleProduct':
            checkBtn1 = `<label class="compare ctaButton unselected checkbox"><input type="checkbox" name="products[]" value="${product.id}"><span>Vergelijk</span></label>`;
            checkBtn2 = '';
            break;
        case 'priceAlert':
            inputField = `<span class="inputEuro"><input class="text" type="text" size="8" name="" id="" value="${product.alertPrice}"></span>`;
            setAlertBtn = '';
            addToListBtn = '';
            addCompareBtn = '';
            break;
        case 'compareProduct':
            addCompareBtn = '';
            addToListBtn = '';
            break;
        case 'productInList':
            setBoughtBtn = `<div class='${product.bought ? 'option setBought active' : 'option setBought'}' style="margin-right: 5px;"></div>`;
            addToListBtn = '';
            boughtPrice = `<span class="boughtPrice" style="display: ${product.bought ? 'block' : 'none'}; float: left; margin-right: 40px; margin-top: 7.5px;">€ ${product.boughtPrice}</span>`
    }

    //Html for the product in the list 
    let html = `
      <div class='itemWrapper' id='${product.id}'>
      <div class="itemContentWrapper">
      ${deleteBtn}
      ${inputField}
      <div class="itemOptions">
      ${boughtPrice}
      ${addCompareBtn}
      ${addToListBtn}
      ${setBoughtBtn}
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
      </div>
      `;

    //Return all the buttons and clickable parts
    return html;
}

//Function to add some suggestions to the view
function appendSuggestions() {
    //Add a 4 suggestion items to the wrapper
    for (i = 11; i < 15; i++) {
        //Create a div for the suggestion item
        let suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        let product = allProducts.filter(product => product.id === allProducts[i].id)[0];

        //Set the HTML
        suggestionItem.innerHTML = `
        <div class="suggestion-item-content">
        <button class="addItem"></button>
        <div class="suggestion-item-info">
        <p style="max-width: 115px; margin-bottom: 5px; color: #1668AC">${allProducts[i].title}</p>
        <p style="max-width: 100px; color: #666666; font-size: 12px;">${allProducts[i].specline}</p>
        </div>
        </div>
        `;

        //Set a background image for the item
        suggestionItem.style.backgroundImage = `url("${allProducts[i].imageUrl}")`;
        suggestionItemWrapper.appendChild(suggestionItem);

        //Eventlistener for the add button in the item
        let addButton = suggestionItem.querySelector('.addItem');
        addButton.addEventListener('click', () => {
            addToMPO(product)
        });
    }
}

//Function that adds products to the MPO array
function addToMPO(product) {
    //Change state of the icon in the header
    iconMPO.classList.add('new');
    singleProducts.push(product);

    let input = document.querySelector(`.mijn-producten-label${product.id}`).querySelector('input');
    input.checked = true;
    computeMPOProducts();
    updateCounter();
}

//Function that removes the product from the MPO array
function deleteFromMPO(product) {
    //Search for the index of the product in the array
    let index = singleProducts.indexOf(product);

    let input = document.querySelector(`.mijn-producten-label${product.id}`).querySelector('input');
    input.checked = false;

    //Remove product
    singleProducts.splice(index, 1)
    computeMPOProducts();
    updateCounter();
}

//Function to add all the products in the MPO array to the view
function computeMPOProducts() {
    //Remove all the HTML from the single products view
    singleProductsContent.innerHTML = '';

    //Append all the items in the array to the view
    singleProducts.forEach(singleProduct => {

        //Create new item element
        let productItem = document.createElement('div');
        //Set the attribute id to the productID and style the element
        productItem.setAttribute('id', singleProduct.id);
        productItem.className = 'productItem';
        //Set the innerHTML for the item to the itemHTML and append it to the contentview
        productItem.innerHTML = generateItemHTML(singleProduct, 'singleProduct');
        singleProductsContent.appendChild(productItem);
        //Define all the buttons of the product item
        let deleteBtn = productItem.querySelector('.delProduct');
        let priceAlertBtn = productItem.querySelector('.setAlert');
        let addToListBtn = productItem.querySelector('.addList');
        let addCompare = productItem.querySelector('.addCompare');
        //Eventlistener for deleting a product from the list
        deleteBtn.addEventListener('click', () => {
            deleteFromMPO(singleProduct)
        })
        //Eventlistener for setting a price alert for the product
        priceAlertBtn.addEventListener('click', () => {
            if (priceAlertBtn.className == 'option setAlert') {
                setPriceAlert(singleProduct, priceAlertBtn);
            } else {
                deletePriceAlert(singleProduct)
            }
        })
        //Eventlistener for adding the product to a list
        addToListBtn.addEventListener('click', () => {
            selectProducts(singleProduct, addToListBtn)
        });

        //Event listener for adding the product to the compare tab
        addCompare.addEventListener('click', () => {
            if (addCompare.className === 'option addCompare') {
                addToCompare(singleProduct);
                changeState(addCompare);
            } else {
                deleteFromCompare(singleProduct);
            }
        })
    })
}

//Function to select products
function selectProducts(product, addToListBtn) {
    changeState(addToListBtn)
    switch (addToListBtn.className) {
        case 'option addList active':
            product.selected = true;
            break;
        default:
            product.selected = false;
    }

    //Filter all the products that are selected and display a popup to the view
    let selectedProducts = Array.from(singleProducts.filter(product => product.selected === true));
    if (selectedProducts.length > 0) {
        addToListPopup.style.display = 'block';
    } else {
        addToListPopup.style.display = 'none';
    }
    updateCounter();
}

//Function for adding products to the compare list
function addToCompare(product) {
    //Change icon in the header
    iconMPO.classList.add('new');

    productsCompare.push(product);

    let input = document.querySelector(`.vergelijk-label${product.id}`).querySelector('input');
    input.checked = true;
    product.compared = true;
    computeCompareProducts();
    updateCounter();
}

//Function to remove items from the compare array
function deleteFromCompare(product) {
    try {
        let addCompareBtn = Array.from(popover.querySelectorAll('.addCompare')).filter(compareBtn => compareBtn.getAttribute('id') === product.id)[0];
        changeState(addCompareBtn);
    } catch {
        //error
    }
    product.compared = false;
    //Search for the index of the product in the array
    let index = productsCompare.indexOf(product)

    //Remove product
    productsCompare.splice(index, 1)

    let input = document.querySelector(`.vergelijk-label${product.id}`).querySelector('input');
    input.checked = false;
    computeCompareProducts();
    updateCounter();
}

function emptyCompare(){
    productsCompare = [];
    computeCompareProducts();
    updateCounter();
}

//Function the append compared products to the view
function computeCompareProducts() {
    //Set innerhtml for the compareview to empty
    compareProducts.innerHTML = '';
    productsCompare.forEach(compareProduct => {
        //Create new div for the product item
        let productItem = document.createElement('div');

        //Set the attribute id to the id and give it a classname
        productItem.setAttribute('id', compareProduct.id);
        productItem.className = 'productItem';

        //Set the innerHTML for the item to the itemHTML and append it to the contentview
        productItem.innerHTML = generateItemHTML(compareProduct, 'compareProduct');
        compareProducts.appendChild(productItem);

        //Grab all the buttons in the product item
        let deletebtn = productItem.querySelector('.delProduct');
        let priceAlertBtn = productItem.querySelector('.setAlert');

        //Add eventlistener to the delete button
        deletebtn.addEventListener('click', () => {
            deleteFromCompare(compareProduct);
        })

        //Eventlistener for setting a price alert for the product
        priceAlertBtn.addEventListener('click', () => {
            if (priceAlertBtn.className == 'option setAlert') {
                setPriceAlert(compareProduct, priceAlertBtn);
            } else {
                deletePriceAlert(compareProduct)
            }
        })
    })
}

//Function for setting a price alert
function setPriceAlert(product, alertBtn) {
    let notification = createNotification('prijsalert', product);

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
    });
}

//Function to delete a price alert
function deletePriceAlert(product) {
    //Search for the alert button 
    try{
    let alertBtn = Array.from(popover.querySelectorAll('.setAlert')).filter(alert => alert.getAttribute('id') === product.id)[0];
    changeState(alertBtn);
    }catch{
        //nothing
    }

    //Set price alert to false
    product.priceAlert = false;
    let index = allPriceAlerts.indexOf(product);
    allPriceAlerts.splice(index, 1);
    calcPriceAlerts();
}

//Function to delete a product from a list
function deleteFromList(list, product) {
    //Search for the index of the product in the array
    let index = list.products.indexOf(product);

    //Remove product
    list.products.splice(index, 1)
    calcLists();
    updateCounter();
}

//Function the calculates all the price alerts in the price alert array
function calcPriceAlerts() {
    priceAlertContent.classList.add('active');
    priceAlertContent.innerHTML = '';
    allPriceAlerts.forEach(priceAlertProduct => {
        //Create new element for the price alert item and append classname
        let priceAlertItem = document.createElement('div');
        priceAlertItem.className = 'price-alert-item';

        //Set the innerhtml and append it to the view
        priceAlertItem.innerHTML = generateItemHTML(priceAlertProduct, 'priceAlert');
        priceAlertContent.appendChild(priceAlertItem);

        //Eventlistener for the delete button
        let deleteBtn = priceAlertItem.querySelector('.delProduct');
        deleteBtn.addEventListener('click', () => {
            deletePriceAlert(priceAlertProduct);
        });
    });
    if (mpoTab.classList.contains('active') && allPriceAlerts.length > 0) {
        priceAlertList.style.display = 'block';
        //Add eventlisteners
        collapsePriceAlerts.addEventListener('click', () => {
            changeState(priceAlertContent)
            if (priceAlertContent.className === 'priceAlertContent') {
                collapsePriceAlerts.style.transform = 'rotate(-180deg)';
            } else {
                collapsePriceAlerts.style.transform = 'rotate(0deg)';
            }
        })
    } else {
        priceAlertList.style.display = 'none';
    }
}

//Function to generate the pop up notification to the view
function createNotification(category, product = null) {
    //Variables in the popup notification
    let popUpTitle;
    let popUpMessage;
    let inputFieldSize;
    let popUpBtnTitle;
    let inputField;
    let ul;
    let newListInput;

    //Create new element and set classname
    let popupNotification = document.createElement('form');
    popupNotification.className = 'popup-notification';
    if (category === 'prijsalert') {
        popUpTitle = 'Prijsalert instellen';
        inputFieldSize = '10';
        popUpBtnTitle = 'Prijsalert instellen';
        popUpMessage = `Je gaat een prijsalert instellen voor <span style="font-weight: bolder">${product.title}</span>`;
        inputField = `<span style="width: 80%;" class="inputEuro"><input  class="text" type="text" size="${inputFieldSize}" name="product" id="" value=""></span>`;
        ul = '';
        newListInput = '';
    } else if (category === 'newlist') {
        popUpTitle = 'Nieuwe lijst maken';
        inputFieldSize = '30';
        popUpBtnTitle = 'Nieuwe lijst aanmaken';
        popUpMessage = 'Typ de naam van de nieuwe lijst';
        inputField = `<span style="width: 80%;"><input  class="text" type="text" size="${inputFieldSize}" name="product" id="" value=""></span>`;
        ul = '';
        newListInput = '';
    } else if (category === 'addToList') {
        popUpTitle = 'Selecteer een lijst';
        inputFieldSize = '0';
        popUpBtnTitle = 'Toevoegen';
        popUpMessage = 'Selecteer de lijsten waaraan je deze producten wilt toevoegen of maak een nieuwe lijst aan';
        inputField = ``;
        ul = `<ul class="lists-popup" style="list-style-type: none">${appendLists()}</ul>`;
        newListInput = `<input type="checkbox" class="checkList newList"><span style="width: 90%;"><input class="text newListName" type="text" size="${inputFieldSize}" name="product" id="" value=""></span></input><br>`;

        //Function to append the lists to the popup notification
        function appendLists() {
            return `${lists.map(function (list) {
            return `<li>
            <input type="checkbox" list-id="${list.id}" class="checkList"></input>
            <span style="font-weight: bolder; font-size: 14px">${list.name}</span>
            <br>
            <span style="font-weight: lighter; font-size: 11px; margin-left: 20px;">${list.products.length} producten in lijst</span>
            </li>`;
        }).join('')}
        `
        }

    } else if (category === 'setBought') {
        popUpTitle = 'Stel de aanschafprijs in';
        inputFieldSize = '10';
        ul = '';
        popUpBtnTitle = 'Aanschafprijs instellen';
        popUpMessage = `Voor welk bedrag heb je de <span style="font-weight: bolder">${product.title}</span> aangeschaft?`;
        inputField = `<span style="width: 80%;" class="inputEuro"><input  class="text" type="text" size="${inputFieldSize}" name="product" id="" value=""></span>`;
        newListInput = '';
    }else if (category === 'deleteList') {
        popUpTitle = 'Weet je het zeker?';
        inputFieldSize = '';
        ul = '';
        popUpBtnTitle = 'Verwijderen';
        popUpMessage = `Weet je zeker dat je deze lijst wil verwijderen?`;
        inputField = ``;
        newListInput = '';
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
    ${newListInput}
    <a class="popup-closeBtn" style="bottom: 15px; right: 15px; position: absolute;">Cancel</a>
    <button type="submit" style="margin-top: 15px;" class="ctaButton">${popUpBtnTitle}</button>
    </div>
    </div>
    `;

    //Set the HTML for the popup
    popupNotification.innerHTML = html;
    popUpContent.appendChild(popupNotification);

    //Eventlistener for closing the button
    topInfo.style.marginTop = `${popupNotification.offsetHeight - 50}px`;
    let closeBtn = popupNotification.querySelector('.popup-closeBtn');
    closeBtn.addEventListener('click', () => {
        closePopup(popupNotification);
    });
    try {
        let checkboxNewList = popupNotification.querySelector('.checkList.newList');
        checkboxNewList.addEventListener('click', () => {
            checkboxNewList.classList.add('selected');
        });
    } catch {
        //error
    }
    try {
        let listsInPopUp = popUpContent.querySelector('.lists-popup');
        let checkboxes = listsInPopUp.querySelectorAll('input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                selectList(checkbox.getAttribute('list-id'));
            })
        });
    } catch {
        //error
    }
    return popupNotification;
}

//Function for closing the popup
function closePopup(popup) {
    popUpContent.removeChild(popup);
    topInfo.style.marginTop = '25px';
}

//Function to append the lists to the view
function calcLists() {
    //Empty the innerhtml of the listview
    allLists.innerHTML = '';
    productsInListCounter = 0;

    //Append each list in the list array
    lists.forEach(list => {

        //Html for the list
        let html = `
        <div class="list-options-top" style="width: auto;">
        <span class="list-title">${list.name}<span> (${list.products.length})</span></span>
        <button class="option delete" style="margin-right: 10px; color: white;">X</button>
        <button class="option share" style="margin-right: 5px;"></button>
        <button class="option collapse" style="margin-right: 5px;"></button>
        </div>
        <div class='list-content active'>
        <p class="noListContent" style="padding-left: 15px; padding-right: 15px; margin-bottom: 0px; text-align: center;">Je hebt nog geen producten toegevoegd aan deze lijst. <a>Bekijk de Pricewatch</a> of voeg producten toe vanuit Mijn Producten</p>
        </div>
        <div class="list-options-bottom">
        <a>Totaal berekenen <span class="counter price" style="color: black; float: right;">€ ${list.totalPrice}</span></a>
        </div>
        `;

        //Create new element for the list, set the classname and append it to the view
        let listElement = document.createElement('div');
        listElement.className = 'list-wrapper';
        listElement.setAttribute('list-id', list.id);
        listElement.innerHTML = html;
        allLists.appendChild(listElement);

        //Grab buttons from the list
        let collapseBtn = listElement.querySelector('.collapse');
        let listContent = listElement.querySelector('.list-content.active');
        let delBtn = listElement.querySelector('.option.delete');
        let noListsText = listElement.querySelector('.noListContent');
        let shareBtn = listElement.querySelector('.option.share');

        //Add eventlisteners
        collapseBtn.addEventListener('click', () => {
            changeState(listContent)
            if (listContent.className === 'list-content') {
                collapseBtn.style.transform = 'rotate(-180deg)';
            } else {
                collapseBtn.style.transform = 'rotate(0deg)';
            }
        })
        delBtn.addEventListener('click', () => {
            deleteList(list);
        });
        shareBtn.addEventListener('click', () => {
            shareList(list);
        });

        //Add all the products to the listview
        let products = list.products;
        if (products.length > 0) {
            noListsText.style.display = 'none';
            products.forEach(productInList => {
                let product = products.filter(product => product.id === productInList.id)[0];

                //Create a element for the product item and append it to the view
                let productItem = document.createElement('div');
                productItem.innerHTML = generateItemHTML(productInList, 'productInList');
                productItem.style.marginTop = '10px';
                listContent.appendChild(productItem);
                listContent.firstElementChild.style.marginTop = '0px';
                let priceAlertBtn = productItem.querySelector('.setAlert');
                let addCompare = productItem.querySelector('.addCompare');

                //Eventlistener for setting a price alert for the product
                priceAlertBtn.addEventListener('click', () => {
                    if (priceAlertBtn.className == 'option setAlert') {
                        setPriceAlert(product, priceAlertBtn);
                    } else {
                        deletePriceAlert(product)
                    }
                });

                //Eventlistener to remove the product from the list
                let deleteProduct = productItem.querySelector('.delProduct');
                deleteProduct.addEventListener('click', () => {
                    deleteFromList(list, productInList);
                })

                //Eventlistener to set a boughtprice for the product
                let boughtBtn = productItem.querySelector('.setBought');
                boughtBtn.addEventListener('click', () => {
                    if (boughtBtn.classList.contains('active')) {
                        deleteBought(productInList, boughtBtn)
                    } else {
                        setBought(productInList, boughtBtn);
                    }
                });

                //Event listener for adding the product to the compare tab
                addCompare.addEventListener('click', () => {
                    if (addCompare.className === 'option addCompare') {
                        addToCompare(product);
                        changeState(addCompare);
                    } else {
                        deleteFromCompare(product);
                    }
                });
            });

            //Display the no list text into the listcontentview
        } else if (products.length < 1) {
            noListsText.style.display = 'block';
        }

        //Function to calculate the totalprice of all the products in the list
        totalPrice();

        function totalPrice() {
            let priceCount = listElement.querySelector('.counter.price');
            priceCount.innerHTML = '';
            list.totalprice = 0;
            let totalPrice = list.totalPrice;
            products.forEach(product => {
                let price = parseFloat(product.price.replace(",", ".").replace(/[^0-9\.-]+/g, ""));
                totalPrice = totalPrice + price;
                list.totalPrice = totalPrice;
            })
            priceCount.innerHTML = `€ ${totalPrice.toFixed(2)}`;
        }
        productsInListCounter = productsInListCounter + list.products.length;
        updateCounter();
    })
}

//Function to delete a list
function deleteList(list) {
    let notification = createNotification('deleteList');
    //If the users submits, the price alert will be set
    let submitButton = notification.querySelector('.ctaButton');
    submitButton.addEventListener('click', () => {

    //Search for the index of the product in the array
    let index = lists.indexOf(list)
    console.log(index);
    //Remove product
    lists.splice(index, 1);
    calcLists();
    updateCounter();
        closePopup(notification);
    });
}

//Function for creating a new list
function createNewList() {
    //Create notification
    let notification = createNotification('newlist');

    //If the user submits the notification the list is being added to the list array
    let id = Math.floor((Math.random() * 11000) + 22000);
    notification.onsubmit = function () {
        let listName = notification.querySelector('input').value;
        lists.push({
            id: id,
            name: listName,
            products: [],
            totalPrice: 0,
            selected: false
        });
        closePopup(notification);
        calcLists();
        updateCounter();
    }
}

//Function to set a boughtprice
function setBought(product, boughtBtn) {
    let itemWrapper = Array.from(allLists.querySelectorAll('.itemWrapper')).filter(elem => elem.getAttribute('id') === product.id)[0];
    let boughtPrice = Array.from(allLists.querySelectorAll('.itemWrapper')).filter(elem => elem.getAttribute('id') === product.id)[0].querySelector('.boughtPrice');

    //Add a notification to set a boughtprice
    let notification = createNotification('setBought', product);

    //If the users submits, the price alert will be set
    notification.onsubmit = function () {
        product.bought = true;
        let value = notification.querySelector('input').value;
        product.boughtPrice = value;
        boughtPrice.innerHTML = `€ ${product.boughtPrice}`;
        itemWrapper.style.border = '1px #9FBF22 solid';
        boughtPrice.style.display = 'block';
        changeState(boughtBtn);
        closePopup(notification);
    }
}

//Function to delete a boughtprice
function deleteBought(product, boughtBtn) {
    let itemWrapper = Array.from(allLists.querySelectorAll('.itemWrapper')).filter(elem => elem.getAttribute('id') === product.id)[0];
    let boughtPrice = allLists.querySelector('.boughtPrice');
    product.bought = false;
    product.boughtPrice = 0;
    boughtPrice.innerHTML = `€ ${product.boughtPrice}`;
    itemWrapper.style.border = 'none';
    boughtPrice.style.display = 'none';
    changeState(boughtBtn);
}

//Function to select a list
function selectList(listid) {
    let list = lists.filter(list => list.id == listid)[0];
    list.selected = true;
}

//Function for adding products to a list
function addToList() {
    //Create notification
    let notification = createNotification('addToList');
    let checkboxNewList = notification.querySelector('.checkList.newList');
    notification.onsubmit = function () {
        if (checkboxNewList.classList.contains('selected')) {
            let id = Math.floor((Math.random() * 11000) + 22000);
            let listName = notification.querySelector('.newListName').value;
            lists.push({
                id: id,
                name: listName,
                products: [],
                totalPrice: 0,
                selected: true
            });
        } else {
            //nothing
        }

        //Add the selected products to the selected list
        let selectedLists = lists.filter(list => list.selected == true);
        let selectedProducts = Array.from(singleProducts.filter(item => item.selected === true));
        selectedLists.forEach(list => {
            selectedProducts.forEach(product => {
                list.products.push(product);
                deleteFromMPO(product);
                product.selected = false;
            })
            list.selected = false;
        })
        closePopup(notification);
        addToListPopup.style.display = 'none';
        calcLists();
    }
}

//Function for updating the counters
function updateCounter() {
    mpoCounter = singleProducts.length + allPriceAlerts.length + productsInListCounter;
    compareCounter = productsCompare.length;
    listCounter = lists.length;
    selectedCounter = Array.from(singleProducts.filter(item => item.selected === true)).length;
    //Grab all the counters on the page
    let counters = document.querySelectorAll('.counter');
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
        } else if (className === 'counter mpo compare') {
            counters[i].innerHTML = '';
            counters[i].innerHTML = mpoCounter + compareCounter;
        }
    }
    //Toggle the introtext and the suggestion items
    if (mpoCounter > 0 || listCounter > 0 || compareCounter > 0) {
        introText.style.display = 'none';
        suggestionItemWrapper.style.display = 'none';
    } else {
        introText.style.display = 'block';
        suggestionItemWrapper.style.display = 'block';
    }
}

// Make the DIV element draggable
dragElement(document.querySelector(".pop-over"));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "dragBar")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "dragBar").onmousedown = dragMouseDown;
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
/*Icon in header */
.iconMPO a{
    display: block;
    height: 44px;
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

.iconMPO.new a{
    background-image: url("data:image/svg+xml,%3Csvg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0H16.4138V17H0V0ZM2.05172 2.34483H5.12931V4.10345H2.05172V2.34483ZM14.3621 2.34483H7.18103V4.10345H14.3621V2.34483ZM2.05172 5.86207H5.12931V7.62069H2.05172V5.86207ZM14.3621 5.86207H7.18103V7.62069H14.3621V5.86207ZM2.05172 9.37931H5.12931V11.1379H2.05172V9.37931ZM14.3621 9.37931H7.18103V11.1379H14.3621V9.37931ZM2.05172 12.8966H5.12931V14.6552H2.05172V12.8966ZM14.3621 12.8966H7.18103V14.6552H14.3621V12.8966Z' fill='%23DAE74B'/%3E%3C/svg%3E%0A");
}
.iconMPO.new span{
    background-color: #eafd6c;
}

.iconMPO.active span{
    display: none;
}
.iconMPO span{
    z-index: 999;
    background-color: #e6e6e6;
    border-radius: 2px;
    color: black;
    text-align: center;
    max-width: 15px;
    max-height: 15px;
    font-size: 11px;
    display: inline;
    margin-top: 5px;
    line-height: normal;
    position: absolute;
    top: 0;
    float: right;
    min-height: 15px;
    margin-left: 25px;
    min-width: 15px;
    font-weight: bolder;    
    vertical-align: top;
    box-shadow: 0 1px 0 1px rgba(0,0,0,0.2);
}

/*General styling of the popover*/

.pop-over{
    z-index: 200;
    position: fixed;
    display: block;
    top: 45px;
    left: 54vw;
    box-shadow:  8px 5px 5px -3px rgba(0,0,0,0.1), 5px 8px 5px -3px rgba(0,0,0,0.1);
    border-color: #cccccc;
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
    border-top: none;
    width: auto;
    height: auto;
    min-height: 700px;
    min-height: 375px;
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
    color: #9a0e36;
}

.contentWrapper{
    background-color: #f2f2f2;
    border-radius: 2px;
    overflow-y: scroll;
    width: 375px;
    height: 655px;
    resize: both;
    overflow: auto;
}

.introText{
    display: block;
    width: 77%;
    text-align: center;
    margin: 0 auto;
    margin-top: 40px;
}

/*Dragbar to drag the element over the page*/
#dragBar{
    height: 15px;
    cursor: move;
    width auto;
    background-color: #9a0e36;
    color: white;
    text-align: right;
    padding-right: 5px;
    padding-left: 5px;
    font-size: 11px;
    border-top-color: white;
    border-top-width: 0.2px;
    border-top-style: solid;
}

#dragBar span{
    line-height: 15px;
    float: right;
}

.dragIcon{
    margin-top: 2px;
    margin-right: 5px;
    height: 11px;
    width: 11px;
    background-size: fit;
    background-position: center center;
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='11' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.9227 5.81738L10.3575 4.25219C10.2829 4.17757 10.1702 4.15566 10.0732 4.19584C9.97564 4.23602 9.91198 4.3315 9.91198 4.43688V5.21948H6.78161V2.08908H7.56421C7.66959 2.08908 7.76506 2.02542 7.80524 1.92787C7.84542 1.83031 7.82297 1.71813 7.7489 1.64351L6.18372 0.0783175C6.08198 -0.0234203 5.91658 -0.0234203 5.81485 0.0783175L4.24966 1.64351C4.17505 1.71864 4.15262 1.83029 4.1928 1.92787C4.23299 2.02542 4.32846 2.08908 4.43384 2.08908H5.21643V5.21948H2.08607V4.43688C2.08607 4.3315 2.02241 4.23602 1.92486 4.19584C1.82887 4.15514 1.71564 4.17757 1.64051 4.25219L0.075326 5.81738C-0.0264108 5.91912 -0.0264108 6.08452 0.075326 6.18626L1.64051 7.75145C1.71564 7.82658 1.82833 7.84955 1.92486 7.8078C2.02241 7.76816 2.08607 7.67268 2.08607 7.56727V6.78467H5.21643V9.91507H4.43384C4.32846 9.91507 4.23299 9.97873 4.1928 10.0763C4.15262 10.1738 4.17507 10.286 4.24915 10.3606L5.81433 11.9258C5.86547 11.9764 5.93223 12.002 5.99902 12.002C6.06581 12.002 6.13258 11.9765 6.18372 11.9258L7.7489 10.3606C7.82351 10.286 7.84594 10.1739 7.80524 10.0763C7.76455 9.97873 7.66959 9.91507 7.56421 9.91507H6.78161V6.78467H9.91198V7.56727C9.91198 7.67265 9.97564 7.76813 10.0732 7.80831C10.1697 7.84952 10.2829 7.82658 10.3575 7.75197L11.9227 6.18677C12.0245 6.08452 12.0245 5.91966 11.9227 5.81738Z' fill='white'/%3E%3C/svg%3E%0A");
}

/*Styling of the tabbar*/
.tabbar{
    list-style-type: none;
    height: 30px;
    width: 100%;
    margin: 0px;
    padding: 0px;
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

/*Lists & product elements*/
.all-lists{
    margin-top: 40px;
}

.list-wrapper{
    margin-bottom: 40px;
}

.list-content{
    display: none;
    border-top: 1px #E5E5E5 solid;
    border-bottom: 1px #E5E5E5 solid;
    max-width: 97%; 
    height: auto; 
    margin: 0 auto; 
    margin-top: 15px; 
    padding-bottom: 10px; 
}
.list-content .itemContentWrapper{
    width: 100%;
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

.collapse{
    background-image: url('data:image/svg+xml, %3Csvg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M5.53176 0.666452L0.191706 6.0066C0.068097 6.13011 0 6.29499 0 6.4708C0 6.6466 0.068097 6.81148 0.191706 6.93499L0.584873 7.32825C0.841066 7.58415 1.25745 7.58415 1.51326 7.32825L5.99751 2.844L10.4867 7.33323C10.6104 7.45674 10.7751 7.52493 10.9508 7.52493C11.1267 7.52493 11.2915 7.45674 11.4152 7.33323L11.8083 6.93996C11.9319 6.81635 12 6.65157 12 6.47577C12 6.29997 11.9319 6.13509 11.8083 6.01158L6.46336 0.666452C6.33936 0.542648 6.1738 0.474648 5.99781 0.475039C5.82112 0.474648 5.65566 0.542648 5.53176 0.666452Z" fill="white"/%3E%3C/svg%3E');
}
.share{
    background-image: url('data:image/svg+xml, %3Csvg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M4.44473 3.00859C3.03077 4.47153 3.33933 6.89934 4.95899 7.97483C5.01236 8.01028 5.08336 8.00325 5.1292 7.95846C5.47018 7.62529 5.75864 7.30257 6.01122 6.89214C6.04987 6.82935 6.02583 6.74786 5.961 6.71274C5.71395 6.5789 5.46812 6.32793 5.32973 6.06283L5.32957 6.06293C5.16379 5.73282 5.10735 5.36279 5.19512 4.98064C5.19521 4.98066 5.1953 4.98068 5.1954 4.98068C5.29639 4.49142 5.82165 4.03629 6.22282 3.61538C6.22197 3.6151 6.22115 3.61479 6.22031 3.61451L7.7234 2.0804C8.3224 1.46904 9.30768 1.464 9.9129 2.06922C10.5242 2.6682 10.5343 3.65845 9.93536 4.26979L9.02492 5.20602C8.98279 5.24935 8.96912 5.31257 8.98884 5.36971C9.19846 5.9776 9.25002 6.83474 9.10955 7.48233C9.10561 7.50045 9.12798 7.51232 9.14094 7.49907L11.0786 5.52137C12.3165 4.25799 12.306 2.20104 11.0553 0.950372C9.77896 -0.325972 7.70112 -0.31535 6.43788 0.973937L4.4525 3.00029C4.44987 3.00306 4.44738 3.00587 4.44473 3.00859Z" fill="white"/%3E%3Cpath d="M8.06699 8.25341C8.06697 8.25348 8.06692 8.25355 8.0669 8.25362C8.06814 8.25311 8.06929 8.25261 8.07053 8.25207C8.46598 7.52896 8.54383 6.69963 8.35849 5.89117L8.35765 5.89203L8.35674 5.89164C8.18076 5.17157 7.6979 4.45655 7.0421 4.01631C6.98569 3.97844 6.89558 3.98283 6.84275 4.02555C6.51056 4.29415 6.18541 4.63857 5.97086 5.07811C5.93716 5.14711 5.96239 5.23 6.0288 5.26855C6.27779 5.41311 6.50266 5.62475 6.65322 5.90573L6.65345 5.90556C6.77078 6.10405 6.88641 6.48067 6.81151 6.88534C6.81147 6.88534 6.8114 6.88534 6.81135 6.88534C6.74148 7.42185 6.19969 7.91398 5.76899 8.35743L5.7692 8.35764C5.44135 8.6929 4.60794 9.54251 4.27423 9.88344C3.67525 10.4948 2.685 10.5049 2.07366 9.90591C1.46232 9.30693 1.45222 8.31667 2.0512 7.70534L2.96433 6.76629C3.00572 6.72373 3.01979 6.66188 3.00138 6.60544C2.79863 5.98334 2.74308 5.14552 2.87106 4.49866C2.87462 4.48063 2.85244 4.46912 2.83957 4.48225L0.931017 6.43019C-0.319512 7.70653 -0.308913 9.78459 0.954605 11.0481C2.23088 12.2986 4.29822 12.2774 5.5487 11.0012C5.98312 10.5152 7.84273 8.79346 8.06699 8.25341Z" fill="white"/%3E%3C/svg%3E');

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
    display: inline-block;
    background-color: white;
    border-radius: 2px;
    background-repeat: no-repeat;
    background-size: fit;
    background-position: center center;
    margin: 10px;
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
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
    text-align: center;
    margin-top: 40px;
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
.productItem{
    margin-bottom: 15px;
}

.itemWrapper{
    height: auto;
}

.itemContentWrapper{
    height: 90px;
    margin: 0 auto;
    width: 97%;
    left: 0;
    right: 0;
    background-color: #E5E5E5;
    border-radius: 2px;
    position: relative;
}

.itemContentWrapper ul{
    list-style-type: none;
    margin-left: 60px;
    padding-top: 10px;
    margin-top: 0px;
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
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 13px;
}

.delProduct{
    float: right; 
    margin: 5px;
}

.imageProduct{
    height: 90px;
    width: 90px;
    background-color: white;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    float: left;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
}

.bottom-info{
    text-align: center;
    margin-top: 50px; 
    margin-bottom: 50px;
    margin: 0 auto;
}

.list-title{
    font-weight: bolder; 
    margin-left: 10px;
    font-size: 14px;
    width: auto;
}

.priceAlertsList{
   margin: 0 auto;
   margin-top: 15px;
   margin-bottom: 30px;
   max-width: 97%;
}

.priceAlertsList .itemContentWrapper{
    width: 100%;
}

.priceAlertsList .option {
    height: 20px; 
    width: 20px;
    float: right;
    background-color: #1668AC;
    border-radius: 2px;
    border: none;
    background-size: 11px;
    background-position: center center;
    background-repeat: no-repeat;
}

.priceAlertContent{
    display: none;
}

.priceAlertContent.active{ 
    border-top: 1px #E5E5E5 solid;
    border-bottom: 1px #E5E5E5 solid; 
    margin: 0 auto; 
    margin-top: 15px;
    padding-bottom: 10px;
    display: block;
    width: 100%;
}
.price-alert-item{
    margin-top: 10px;
    width: 100%;
}

.price-alert-item .inputEuro{
    right: 5px;  
    bottom: 5px; 
    position: absolute;
}

.list-wrapper .option{
    height: 20px; 
    width: 20px;
    float: right;
}

.itemOptions{
    right: 5px;
    bottom: 5px;
    position: absolute;
    float: right; 
    margin-right: 0px;
}

/*Product options active state and background SVG*/
.itemOptions .option{
    background-color: #D9D9D9;
    background-position: center center;
    background-size: contain; 
    background-repeat: no-repeat;
    background-size: 17px;
    border-radius: 2px;
    height: 30px;
    width: 30px;
    float: left;
}

.option.active{
    background-color: #9FBF22;
    color: white;
}

.option.addCompare{
    width: auto;
    line-height: 30px;
    padding-left: 5px;
    padding-right: 5px;
}

.option.addList{
    background-image: url("data:image/svg+xml,%3Csvg width='18' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'%3E%3Crect y='3.63312' width='13.3333' height='1.45326' fill='%231668AC'/%3E%3Crect width='13.3333' height='1.45326' fill='%231668AC'/%3E%3Crect y='7.2663' width='8' height='1.45326' fill='%231668AC'/%3E%3Crect y='10.8994' width='8' height='1.45326' fill='%231668AC'/%3E%3Cpath d='M14.2757 9.65405H17.0511V10.8503H14.2757V13.9949H13.0042V10.8503H10.2288V9.65405H13.0042V6.74878H14.2757V9.65405Z' fill='%231668AC'/%3E%3C/svg%3E");
}

.option.addList.active{
    background-image: url('data:image/svg+xml, %3Csvg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect y="3.63312" width="13.3333" height="1.45326" fill="white"/%3E%3Crect width="13.3333" height="1.45326" fill="white"/%3E%3Crect y="7.2663" width="8" height="1.45326" fill="white"/%3E%3Crect y="10.8994" width="8" height="1.45326" fill="white"/%3E%3Cpath d="M15.3216 11.281H11.9857V10.2488H15.3216V11.281Z" fill="white"/%3E%3C/svg%3E');
}

.option.setAlert{
    background-image: url("data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M16.9896 8.58849C16.6885 8.58849 16.4442 8.34349 16.4442 8.04161C16.4442 5.94744 15.6312 3.97944 14.1549 2.4985C13.9419 2.28487 13.9419 1.93854 14.1549 1.72491C14.368 1.51129 14.7134 1.51129 14.9266 1.72491C16.6086 3.41214 17.535 5.65585 17.535 8.04161C17.535 8.34349 17.2906 8.58849 16.9896 8.58849Z' fill='%231668AC'/%3E%3Cpath d='M2.08155 8.58855C1.78048 8.58855 1.53613 8.34356 1.53613 8.04168C1.53613 5.65591 2.46265 3.4122 4.14537 1.72565C4.35842 1.51202 4.70397 1.51202 4.91702 1.72565C5.13008 1.93927 5.13008 2.28574 4.91702 2.49936C3.44003 3.9795 2.62697 5.94751 2.62697 8.04168C2.62697 8.34356 2.38262 8.58855 2.08155 8.58855Z' fill='%231668AC'/%3E%3Cpath d='M9.53568 18.25C8.03179 18.25 6.80859 17.0235 6.80859 15.5156C6.80859 15.2137 7.05294 14.9688 7.35401 14.9688C7.65508 14.9688 7.89943 15.2137 7.89943 15.5156C7.89943 16.4206 8.63313 17.1562 9.53568 17.1562C10.4381 17.1562 11.1719 16.4206 11.1719 15.5156C11.1719 15.2137 11.4163 14.9688 11.7173 14.9688C12.0184 14.9688 12.2628 15.2137 12.2628 15.5156C12.2628 17.0235 11.0396 18.25 9.53568 18.25Z' fill='%231668AC'/%3E%3Cpath d='M15.5356 16.0625H3.5364C2.83452 16.0625 2.26367 15.4901 2.26367 14.7865C2.26367 14.4131 2.42586 14.0595 2.70882 13.8167C3.81483 12.8797 4.44534 11.5177 4.44534 10.0746V8.04162C4.44534 5.22714 6.72887 2.9375 9.53598 2.9375C12.343 2.9375 14.6265 5.22714 14.6265 8.04162V10.0746C14.6265 11.5177 15.257 12.8797 16.3558 13.8116C16.646 14.0595 16.8082 14.4131 16.8082 14.7865C16.8082 15.4901 16.2373 16.0625 15.5356 16.0625ZM9.53598 4.03125C7.33021 4.03125 5.53617 5.83009 5.53617 8.04162V10.0746C5.53617 11.8398 4.76465 13.5068 3.42002 14.6464C3.39459 14.6683 3.35451 14.7136 3.35451 14.7865C3.35451 14.8856 3.43746 14.9688 3.5364 14.9688H15.5356C15.6344 14.9688 15.7173 14.8856 15.7173 14.7865C15.7173 14.7136 15.6774 14.6683 15.6533 14.6479C14.3072 13.5068 13.5357 11.8398 13.5357 10.0746V8.04162C13.5357 5.83009 11.7416 4.03125 9.53598 4.03125Z' fill='%231668AC'/%3E%3Cpath d='M9.53565 4.03125C9.23458 4.03125 8.99023 3.78625 8.99023 3.48438V1.29688C8.99023 0.994999 9.23458 0.75 9.53565 0.75C9.83672 0.75 10.0811 0.994999 10.0811 1.29688V3.48438C10.0811 3.78625 9.83672 4.03125 9.53565 4.03125Z' fill='%231668AC'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Crect width='17.4533' height='17.5' fill='white' transform='translate(0.820312 0.75)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
}

.option.setAlert.active{
    background-image: url("data:image/svg+xml,%3Csvg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M16.9896 8.58846C16.6885 8.58846 16.4442 8.34346 16.4442 8.04158C16.4442 5.94741 15.6312 3.97941 14.1549 2.49847C13.9419 2.28484 13.9419 1.93851 14.1549 1.72488C14.368 1.51126 14.7134 1.51126 14.9266 1.72488C16.6086 3.41211 17.535 5.65582 17.535 8.04158C17.535 8.34346 17.2906 8.58846 16.9896 8.58846Z' fill='white'/%3E%3Cpath d='M2.08155 8.58852C1.78048 8.58852 1.53613 8.34352 1.53613 8.04165C1.53613 5.65588 2.46265 3.41217 4.14537 1.72562C4.35842 1.51199 4.70397 1.51199 4.91702 1.72562C5.13008 1.93924 5.13008 2.28571 4.91702 2.49933C3.44003 3.97947 2.62697 5.94748 2.62697 8.04165C2.62697 8.34352 2.38262 8.58852 2.08155 8.58852Z' fill='white'/%3E%3Cpath d='M9.53568 18.25C8.03179 18.25 6.80859 17.0235 6.80859 15.5156C6.80859 15.2137 7.05294 14.9688 7.35401 14.9688C7.65508 14.9688 7.89943 15.2137 7.89943 15.5156C7.89943 16.4206 8.63313 17.1562 9.53568 17.1562C10.4381 17.1562 11.1719 16.4206 11.1719 15.5156C11.1719 15.2137 11.4163 14.9688 11.7173 14.9688C12.0184 14.9688 12.2628 15.2137 12.2628 15.5156C12.2628 17.0235 11.0396 18.25 9.53568 18.25Z' fill='white'/%3E%3Cpath d='M15.5356 16.0625H3.5364C2.83452 16.0625 2.26367 15.4901 2.26367 14.7865C2.26367 14.4131 2.42586 14.0595 2.70882 13.8167C3.81483 12.8797 4.44534 11.5177 4.44534 10.0746V8.04162C4.44534 5.22714 6.72887 2.9375 9.53598 2.9375C12.343 2.9375 14.6265 5.22714 14.6265 8.04162V10.0746C14.6265 11.5177 15.257 12.8797 16.3558 13.8116C16.646 14.0595 16.8082 14.4131 16.8082 14.7865C16.8082 15.4901 16.2373 16.0625 15.5356 16.0625ZM9.53598 4.03125C7.33021 4.03125 5.53617 5.83009 5.53617 8.04162V10.0746C5.53617 11.8398 4.76465 13.5068 3.42002 14.6464C3.39459 14.6683 3.35451 14.7136 3.35451 14.7865C3.35451 14.8856 3.43746 14.9688 3.5364 14.9688H15.5356C15.6344 14.9688 15.7173 14.8856 15.7173 14.7865C15.7173 14.7136 15.6774 14.6683 15.6533 14.6479C14.3072 13.5068 13.5357 11.8398 13.5357 10.0746V8.04162C13.5357 5.83009 11.7416 4.03125 9.53598 4.03125Z' fill='white'/%3E%3Cpath d='M9.53565 4.03125C9.23458 4.03125 8.99023 3.78625 8.99023 3.48438V1.29688C8.99023 0.994999 9.23458 0.75 9.53565 0.75C9.83672 0.75 10.0811 0.994999 10.0811 1.29688V3.48438C10.0811 3.78625 9.83672 4.03125 9.53565 4.03125Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Crect width='17.4533' height='17.5' fill='white' transform='translate(0.820312 0.75)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
}

.option.setBought{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='9px' height='10px' viewBox='0 0 9 10' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3ECombined Shape%3C/title%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Custom-Preset-Copy' transform='translate(-247.000000, -245.000000)' fill='%231668AC' fill-rule='nonzero'%3E%3Cg id='bag' transform='translate(247.500000, 245.000000)'%3E%3Cpath d='M3.99974611,0 C4.54877695,0 5.06434696,0.194375 5.45017087,0.5475 C5.83599478,0.900625 6.04836865,1.3725 6.04836865,1.875 L6.04836865,1.875 L6.04836865,2.5 L7.07267992,2.5 C7.24954434,2.5 7.39704516,2.623125 7.41343414,2.784375 L7.41343414,2.784375 L7.99456007,8.636875 C8.02870378,8.985625 7.9010063,9.334375 7.64287986,9.593125 C7.38475342,9.851875 7.01736711,10 6.6342747,10 L6.6342747,10 L1.3659004,10 C0.982807985,10 0.615421676,9.851875 0.357295236,9.593125 C0.0991687958,9.334375 -0.02921155,8.985625 0.00561503314,8.636875 L0.00561503314,8.636875 L0.58674096,2.784375 C0.602447067,2.623125 0.749947889,2.5 0.926812302,2.5 L0.926812302,2.5 L1.95112357,2.5 L1.95112357,1.875 C1.95112357,0.84125 2.87027222,0 3.99974611,0 Z M1.95112357,3.125 L1.2388858,3.125 L0.686440591,8.693125 C0.668685862,8.870625 0.730827412,9.04 0.861939255,9.17125 C0.992368223,9.3025 1.17196413,9.375 1.3659004,9.375 L1.3659004,9.375 L6.63359183,9.375 C6.82821097,9.375 7.007124,9.3025 7.13823584,9.171875 C7.26934769,9.040625 7.33148924,8.870625 7.31373451,8.69375 L7.31373451,8.69375 L6.76060642,3.125 L6.04836865,3.125 L6.04836865,4.0625 C6.04836865,4.235 5.89540484,4.375 5.70693156,4.375 C5.51845829,4.375 5.36549447,4.235 5.36549447,4.0625 L5.36549447,4.0625 L5.36549447,3.125 L2.63399775,3.125 L2.63399775,4.0625 C2.63399775,4.235 2.48103394,4.375 2.29256066,4.375 C2.10408739,4.375 1.95112357,4.235 1.95112357,4.0625 L1.95112357,4.0625 L1.95112357,3.125 Z M4.33410294,4.8439759 C4.64402987,4.8439759 4.96108154,4.94501279 5.28525798,5.14708656 L5.28525798,5.14708656 L5.03945387,5.59197478 L4.92367657,5.49636998 C4.72774576,5.35151423 4.5169717,5.27908636 4.2913544,5.27908636 C4.05267505,5.27908636 3.85318186,5.3654566 3.69287483,5.53819708 C3.55750445,5.69138203 3.4666638,5.88204841 3.42035288,6.11019622 L3.42035288,6.11019622 L4.83105473,6.11019622 L4.69212197,6.42308464 L3.38294791,6.42308464 L3.37894023,6.45241792 L3.37894023,6.45241792 L3.37760434,6.49152898 L3.37793831,6.66111205 C3.37860626,6.7118342 3.38027612,6.74330638 3.38294791,6.75552858 L3.38294791,6.75552858 L4.61731203,6.75552858 L4.48372284,7.06352812 L3.40966574,7.06352812 L3.44108592,7.21508344 C3.49067423,7.4080313 3.57104149,7.56447551 3.68218769,7.68441607 C3.84249472,7.87019357 4.0597998,7.96308232 4.33410294,7.96308232 C4.51222186,7.96308232 4.66006057,7.93700828 4.77761906,7.88486021 C4.88449041,7.8359714 5.00561127,7.75449004 5.14098165,7.64041613 L5.14098165,7.64041613 L5.14098165,8.18308198 L4.99243047,8.26052187 C4.79008738,8.35230247 4.57064487,8.39819277 4.33410294,8.39819277 C3.85674424,8.39819277 3.48447569,8.26456334 3.21729731,7.99730449 C2.98574271,7.76589743 2.84146639,7.45463864 2.78446833,7.06352812 L2.78446833,7.06352812 L2.37301362,7.06352812 L2.51728995,6.75552858 L2.75775049,6.75552858 L2.75307487,6.72008419 L2.75307487,6.72008419 L2.74973514,6.68219536 C2.74795395,6.65612132 2.74706336,6.62841766 2.74706336,6.59908437 L2.7477313,6.56241776 L2.7477313,6.56241776 L2.74973514,6.52086227 C2.75151633,6.49152898 2.75418812,6.45893643 2.75775049,6.42308464 L2.75775049,6.42308464 L2.37301362,6.42308464 L2.51194638,6.11019622 L2.79515547,6.11019622 L2.84577093,5.9293076 C2.94027291,5.63869076 3.08548931,5.40239482 3.28142012,5.22041978 C3.55572326,4.9694572 3.90661753,4.8439759 4.33410294,4.8439759 Z M3.99974611,0.625 C3.24653589,0.625 2.63399775,1.185625 2.63399775,1.875 L2.63399775,1.875 L2.63399775,2.5 L5.36549447,2.5 L5.36549447,1.875 C5.36549447,1.539375 5.22482239,1.224375 4.96737883,0.989375 C4.70993526,0.754375 4.36644955,0.625 3.99974611,0.625 Z' id='Combined-Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.option.setBought.active{
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='9px' height='10px' viewBox='0 0 9 10' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3ECombined Shape%3C/title%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Custom-Preset-Copy' transform='translate(-247.000000, -245.000000)' fill='%23FFFFFF' fill-rule='nonzero'%3E%3Cg id='bag' transform='translate(247.500000, 245.000000)'%3E%3Cpath d='M3.99974611,0 C4.54877695,0 5.06434696,0.194375 5.45017087,0.5475 C5.83599478,0.900625 6.04836865,1.3725 6.04836865,1.875 L6.04836865,1.875 L6.04836865,2.5 L7.07267992,2.5 C7.24954434,2.5 7.39704516,2.623125 7.41343414,2.784375 L7.41343414,2.784375 L7.99456007,8.636875 C8.02870378,8.985625 7.9010063,9.334375 7.64287986,9.593125 C7.38475342,9.851875 7.01736711,10 6.6342747,10 L6.6342747,10 L1.3659004,10 C0.982807985,10 0.615421676,9.851875 0.357295236,9.593125 C0.0991687958,9.334375 -0.02921155,8.985625 0.00561503314,8.636875 L0.00561503314,8.636875 L0.58674096,2.784375 C0.602447067,2.623125 0.749947889,2.5 0.926812302,2.5 L0.926812302,2.5 L1.95112357,2.5 L1.95112357,1.875 C1.95112357,0.84125 2.87027222,0 3.99974611,0 Z M1.95112357,3.125 L1.2388858,3.125 L0.686440591,8.693125 C0.668685862,8.870625 0.730827412,9.04 0.861939255,9.17125 C0.992368223,9.3025 1.17196413,9.375 1.3659004,9.375 L1.3659004,9.375 L6.63359183,9.375 C6.82821097,9.375 7.007124,9.3025 7.13823584,9.171875 C7.26934769,9.040625 7.33148924,8.870625 7.31373451,8.69375 L7.31373451,8.69375 L6.76060642,3.125 L6.04836865,3.125 L6.04836865,4.0625 C6.04836865,4.235 5.89540484,4.375 5.70693156,4.375 C5.51845829,4.375 5.36549447,4.235 5.36549447,4.0625 L5.36549447,4.0625 L5.36549447,3.125 L2.63399775,3.125 L2.63399775,4.0625 C2.63399775,4.235 2.48103394,4.375 2.29256066,4.375 C2.10408739,4.375 1.95112357,4.235 1.95112357,4.0625 L1.95112357,4.0625 L1.95112357,3.125 Z M4.33410294,4.8439759 C4.64402987,4.8439759 4.96108154,4.94501279 5.28525798,5.14708656 L5.28525798,5.14708656 L5.03945387,5.59197478 L4.92367657,5.49636998 C4.72774576,5.35151423 4.5169717,5.27908636 4.2913544,5.27908636 C4.05267505,5.27908636 3.85318186,5.3654566 3.69287483,5.53819708 C3.55750445,5.69138203 3.4666638,5.88204841 3.42035288,6.11019622 L3.42035288,6.11019622 L4.83105473,6.11019622 L4.69212197,6.42308464 L3.38294791,6.42308464 L3.37894023,6.45241792 L3.37894023,6.45241792 L3.37760434,6.49152898 L3.37793831,6.66111205 C3.37860626,6.7118342 3.38027612,6.74330638 3.38294791,6.75552858 L3.38294791,6.75552858 L4.61731203,6.75552858 L4.48372284,7.06352812 L3.40966574,7.06352812 L3.44108592,7.21508344 C3.49067423,7.4080313 3.57104149,7.56447551 3.68218769,7.68441607 C3.84249472,7.87019357 4.0597998,7.96308232 4.33410294,7.96308232 C4.51222186,7.96308232 4.66006057,7.93700828 4.77761906,7.88486021 C4.88449041,7.8359714 5.00561127,7.75449004 5.14098165,7.64041613 L5.14098165,7.64041613 L5.14098165,8.18308198 L4.99243047,8.26052187 C4.79008738,8.35230247 4.57064487,8.39819277 4.33410294,8.39819277 C3.85674424,8.39819277 3.48447569,8.26456334 3.21729731,7.99730449 C2.98574271,7.76589743 2.84146639,7.45463864 2.78446833,7.06352812 L2.78446833,7.06352812 L2.37301362,7.06352812 L2.51728995,6.75552858 L2.75775049,6.75552858 L2.75307487,6.72008419 L2.75307487,6.72008419 L2.74973514,6.68219536 C2.74795395,6.65612132 2.74706336,6.62841766 2.74706336,6.59908437 L2.7477313,6.56241776 L2.7477313,6.56241776 L2.74973514,6.52086227 C2.75151633,6.49152898 2.75418812,6.45893643 2.75775049,6.42308464 L2.75775049,6.42308464 L2.37301362,6.42308464 L2.51194638,6.11019622 L2.79515547,6.11019622 L2.84577093,5.9293076 C2.94027291,5.63869076 3.08548931,5.40239482 3.28142012,5.22041978 C3.55572326,4.9694572 3.90661753,4.8439759 4.33410294,4.8439759 Z M3.99974611,0.625 C3.24653589,0.625 2.63399775,1.185625 2.63399775,1.875 L2.63399775,1.875 L2.63399775,2.5 L5.36549447,2.5 L5.36549447,1.875 C5.36549447,1.539375 5.22482239,1.224375 4.96737883,0.989375 C4.70993526,0.754375 4.36644955,0.625 3.99974611,0.625 Z' id='Combined-Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

/*Popup notification styling*/
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

.popUpContent{
    height: auto; 
    width: 100%; 
    background-color: #f2f2f2;
    border-radius: 2px;
    position: absolute;
    top: 45px;
    left: 0;
    right: 0;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #d9d9d9; 
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
    color: black;
    padding: 10px;
    border-radius: 2px;
    position: relative;
    padding: 0px;
    margin-bottom: 10px;

}
.popup-notification .bodyText{
    margin-bottom: 5px;
}

.addListPopup{
    display:none;
    height: 60px; 
    line-height: 60px;
}

/* scrollbar styling */
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

/*top notification styling*/
.top-notification{
    width: 700px;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px #eafd6c solid;
    background-color: rgba(234, 253, 108, 0.7);
    height: 50px;
    position: fixed;
    right: 1;
    margin: 0 auto;
    z-index: 10;
    text-align: center;
    font-size: 12px;
    border-radius: 2px;
    display: table-cell;
    vertical-align: middle;
    display: table;
   
}
.top-notification span{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

/*Responsive css*/
@media only screen and (max-width: 767px) {
    .contentWrapper{
        height: 90vh;
        width: 100vw;
    }
    .pop-over{
        position: abosulute;
        left: 0px;
        right: 0px;
        bottom: 0;
    }
    .iconMPO{
        width: 44px;
    }
    #dragBar{
        display: none;
    }
    .popUpContent{
        top: 30px;
    }
  }

`
head.appendChild(style);

//Share the list function
function shareList(list) {
    let username = document.querySelector('.username').innerText;
    //Create new tab window
    let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));
    win.document.body.innerHTML = `
    <style>
    .share-wrapper{
    }
    .share-top-logo{
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 282.34 76.97'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23dae64a;%7D.cls-2%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Cg id='Laag_2' data-name='Laag 2'%3E%3Cg id='Layer_1' data-name='Layer 1'%3E%3Cpath class='cls-1' d='M74.71,25.48a.78.78,0,0,1,0,.09l-21,28.33a5.3,5.3,0,0,1-4.54,2.43H28.63c-2.74,0-3.89-.76-5.05-3.64L17.35,32.58a5.58,5.58,0,0,1,.44-5.35L38.66,0h-.17A38.47,38.47,0,1,0,74.71,25.48Z'/%3E%3Cpath d='M17.35,32.58l6.23,20.11c1.16,2.88,2.31,3.64,5.05,3.64h20.6a5.3,5.3,0,0,0,4.54-2.43l21-28.33a.78.78,0,0,0,0-.09A38.5,38.5,0,0,0,38.66,0L17.79,27.23A5.58,5.58,0,0,0,17.35,32.58Zm8.52-6.88H51.39V34H42.82V48.09H34.54V34H25.87Z'/%3E%3Cpolygon class='cls-2' points='34.53 48.09 42.82 48.09 42.82 33.98 51.39 33.98 51.39 25.7 25.87 25.7 25.87 33.98 34.53 33.98 34.53 48.09'/%3E%3Cpath d='M144,48.07h-7.11L132.71,34l-4.09,14.11h-7.13l-7.12-22.33H121l4.42,13.74,3.62-13.71h7.49l3.63,13.71,4.28-13.74h6.61Z'/%3E%3Cpath d='M169.55,47.64a19.63,19.63,0,0,1-5.88.63c-7.22,0-11-5.23-11-11.22,0-5,2.31-11.65,10.71-11.65,8.21,0,11.08,5,10.09,14.19H159.37c0,2.09,2.43,3.45,4.65,3.45a12.41,12.41,0,0,0,3.8-.47Zm-5.9-17c-1.33,0-4.27.09-4.23,4.23h8.3C167.67,31,165.66,30.63,163.65,30.6Z'/%3E%3Cpath d='M239.79,47.68a19.63,19.63,0,0,1-5.88.63c-7.22,0-11-5.23-11-11.23,0-5,2.31-11.65,10.71-11.65,8.2,0,11.08,5.05,10.09,14.2H229.61c0,2.09,2.43,3.45,4.65,3.45a12.14,12.14,0,0,0,3.8-.48Zm-5.9-17c-1.33,0-4.27.09-4.23,4.23H238C237.91,31,235.9,30.66,233.89,30.64Z'/%3E%3Cpath d='M180.1,26.45a28.93,28.93,0,0,1,7.15-1.05c5,0,8.36,2.2,8.36,7V48h-5.53c-.05,0-.23-1-.32-1a12.72,12.72,0,0,1-5.6,1.27c-6.13,0-7.81-4-7.81-6.65,0-4.45,3.1-7.75,11.28-7.69h1.68v-.72c0-1,.1-2.63-2.39-2.63a19.77,19.77,0,0,0-5.07.73Zm9.25,12.21h-1c-4.31,0-6.19.68-6.19,2.84,0,1.58,1.23,2.21,2.66,2.21s3.77-.46,4.58-1.37Z'/%3E%3Cpath d='M214.61,48l-7-10.55V48h-6.83V21.52h6.83V33.64l5.75-7.93h7.75l-7.16,9.74L222.27,48Z'/%3E%3Cpath d='M263,26.19c-.27.8-1.84,5.19-1.84,5.19-2.3-1.24-6.57-.13-6.64,4.85V48h-6.61V25.71H253l.75,1.18a8.46,8.46,0,0,1,5.2-1.46,10.64,10.64,0,0,1,4,.71'/%3E%3Cpath d='M111,42.16a5.94,5.94,0,0,1-4-1c-1.32-1-1.23-2.86-1.25-4.6v0c0-1.54,0-3.24,0-4.67H111V25.79h-5.28V21.52H99.5v4.27H93.83v6.08h5.64c0,1.45,0,3.18,0,4.74v0c0,2.59.07,6.51,2.84,9.2,1.77,1.73,5.12,2.46,8.36,2.46h.3Z'/%3E%3Cpath d='M280.65,46.18c-1.2,1.3-2.38,2.14-6,2.14a23.2,23.2,0,0,1-4.78-.62,37,37,0,0,1-4.17-1.25l1.94-5.55,2.69.79c2.83.84,4.77,1.42,5.23.06a1.42,1.42,0,0,0-.25-1.53,5.93,5.93,0,0,0-1.47-.94c-.71-.35-5.4-2.31-6.52-3.25a4.78,4.78,0,0,1-1.71-3.86,7,7,0,0,1,3.34-6c3-1.74,8.77-.22,9.86.05a15.34,15.34,0,0,1,3.12,1.15l-1.75,4.88c.31.18-6.33-2.71-7.21-1a1.24,1.24,0,0,0,.31,1.79c.35.31,4.47,2.14,5.59,2.69C284.56,38.62,281.82,44.91,280.65,46.18Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        background-repeat: no-repeat;
        width: 197px;
        height: 54px;
        width: 100%;
        background-position: center center;
        background-size: fit;
        margin-top: 45px;
    }
    .line{
        height: 1px;
        background-color: #e6e6e6;
        width: 50%;
        margin: 0 auto;
        margin-top: 45px;
    }
    .share-list-title{
        font-size: 26px;
        font-family: Arial;
        font-weight: bolder;
        color: #9a0e36;
    }
    .share-content{
        margin: 0 auto;
        width: 50%;
        margin-top: 30px;
        font-family: arial;
    }
    .share-content a{
        color: #1668AC;
    }
    .bold-info{
        font-weight: bolder;
    }
    .share-product-image{
        width: 90px;
        height: 90px;
        float: left;
        background-size: fit;
        background-repeat: no-repeat;
        height: 100%;
        background-position: center;
    }
    .share-product{
        width: 100%;
        height: 105px;
        border-bottom: 1px #e6e6e6 solid;
        margin: 0 auto;
        position: relative;
    }
    .share-product-info{
        margin-left: 20px;
        float: left;
        margin-top: 23px;
    }
    .share-product-title{
        color: #1668AC;
        font-size: 15px;
    }
    .share-product-specs{
        color: #e6e6e6;
        font-size: 12px;
    }
    .button{
        background-color: #1668AC;
        height: 30px;
        width: auto;
        padding-right: 10px;
        padding-left: 10px;
        color: white;
        float: right;
        border-radius: 2px;
        line-height: 30px;
        font-size: 12px;
        top: 35%;
        right: 0;

    }
    </style>
    <div class="share-wrapper">
    <div class="share-top-logo"></div>
    <div class="line"></div>
    <div class="share-content">
    <span class="share-list-title">${list.name}</span>
    <br>
    <span class="share-list-subtitle">Een lijst van <a>${username}</a></span>
    <br><br><br>
    <span class="share-list-text">Onderstaande producten staan in de lijst <a>${list.name}</a>. Onderaan de lijst kunnen de totale kosten worden berekend.</span> 
    <br><br><br><br>
    <span class="share-list-info"><span class="bold-info">${list.products.length} producten</span>, met een totaalprijs van <span class="bold-info">€ ${list.totalPrice.toFixed(2)}</span></span>
    <div style="width: 100%; margin-top: 10px;" class="line"></div> 
    <div class="shared-list">
    ${appendProducts()}
    </div>
    <a class="button" style="color: white; float: left; margin-top: 40px;">Totale kosten berekenen</a>
    <span style="float: left; width: 100%; margin-top: 30px" class="share-list-text">Zelf ook een lijst aanmaken? <a>Bekijk de pricewatch</a> en sla jouw favoriete producten op in Mijn Producten.</span>
    <div style="width: 100%; margin-top: 10px; float: left; margin-top: 30px;" class="line"></div> 
    </div>
    <span style="font-size: 13px; color: grey; text-align: center; width: 100%; float: left; font-family: arial; margin-top: 10px; margin-bottom: 30px">Deze lijst is gedeeld door ${username}</span>
    </div>    
    `;
    //Add products to the shared list
    function appendProducts() {
        return `
        ${list.products.map(product => {
            return `
            <div class="share-product">
            <div class="share-product-image" style="background-image: url('${product.imageUrl}');"></div>
            <div class="share-product-info">
            <span class="share-product-title">${product.title}</span>
            <br>
            <span class"share-product-specs">${product.specline}</span> 
            <br>
            <span class="share-product-title">${product.price}</span>
            </div>
            <a class="button" style="color: white; position: absolute;">Bekijk product</a>
            </div>
            `           
        }).join("")}
        `;
    }
}