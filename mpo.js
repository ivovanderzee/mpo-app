//JSON data that gets all the products when the page loads
let productsOnPage = [];
let productsMPO = [];
let productsCompare = [];

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
<div style="height: auto; margin-bottom: 50px;" class="content"></div>
<div style="text-align: center" class="bottomInfo">
<p style="margin-bottom: 5px; font-size: 12px;"><a href="#"><span>${listCounter}</span> lijsten, met in totaal <span class="counter3">${mpoCounter}</span> producten</a></p>
<p style="margin-bottom: 15px; font-size: 18px; font-weight: bolder;">Meer producten toevoegen?</p>
<a class="ctaButton">Bekijk Pricewatch</a>
</div>
</div
</div>
`
//Create a new popover and set the styling and innerHTML
let popover = document.createElement('div');
popover.innerHTML = html;
popover.style.zIndex = '200';
popover.style.position = 'fixed';
popover.style.cursor = 'move';
popover.style.top = '50px';
popover.style.left = '550px';
popover.className = 'popupContent';
popover.style.boxShadow = '8px 5px 5px -3px rgba(0,0,0,0.1), 5px 8px 5px -3px rgba(0,0,0,0.1)';

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
contentWrapper.style.overflowY = 'hidden';
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

    tabButtons[i].addEventListener('click', () => {
        if(className == 'active'){

        }
    })
}

//Function for adding products to the content listview
function addToMPO(productID, label){
    //Create new item element
    let item = document.createElement('div');

    //Set the attribute id to the productID and style the element
    item.setAttribute('id', productID);
    item.className = 'productItem';
    item.style.marginBottom = "40px";
    label.classList.remove('unselected');
    label.classList.add('selected');
 
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
           <span class='alert' style="border-radius: 2px; width: 35px; height: 35px; margin-top: 43px; margin-right: -20px; float: right; background-color: #D9D9D9;"></span>
           <span class='alert' style="border-radius: 2px; width: 35px; height: 35px; margin-top: 43px; margin-right: 5px; float: right; background-color: #D9D9D9;"></span>
           <div style='height: 80px; width: 80px; background-color: white; float: left; border-top-left-radius: 2px; border-bottom-left-radius: 2px' class="imageProduct" >
           <img style="background-size: contain; width: 100%;" src='${image}'>
           </div>
           <div class='itemInfo'>
           <ul style="list-style-type: none; margin-left: 50px; padding-top: 10px;">
           <li style="max-width: 200px; max-height: 16px; overflow-x: hidden; font-weight: bolder; font-size: 14px; word-wrap: break-word;"><span class='titleProduct'><a>${title}</a></span></li>
           <li style="max-width: 150px;  font-size: 12px; word-wrap: break-word; overflow-x: hidden; margin-top: 5px; max-height: 16px;"> <span class='speclineProduct'><a style="color: #666666;">${specs}</a></span></li>
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
           let deletebtn = item.querySelector('.closeButton');
           deletebtn.addEventListener('click', () => {
           deleteFromMPO(productID, label);
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
let iconCompare = document.querySelector('.icon.compare');
iconCompare.addEventListener('click', () => {
    try{
    let popup = document.querySelector('.popup');
    let popupContent = popup.querySelector('.popupContent');
    popup.removeChild(popupContent)
    }catch{
        //error
    }
});