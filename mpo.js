//JSON data that gets all the products when the page loads
let productsOnPage = [];
let productsMPO = [];

let mpoCounter = 0;
let compareCounter = 0;
let listCounter = 0;

//Hiding the scrollbar
HideScrollbar();

//List of all the products
let listing = document.querySelector('.listing.useVisitedState');

//Push all the products in an array
let products = listing.querySelectorAll('.largethumb');


//Add the checkbox the to all the products in the list
for(i=0; i < products.length; i++){
let id = products[i].querySelector('input').getAttribute('value');
let title = products[i].querySelector('.itemname').querySelector('.ellipsis').querySelector('a').innerText;
let specline = products[i].querySelector('.itemname').querySelector('.specline.ellipsis').querySelector('a').innerText;
let price = products[i].querySelector('.price').querySelector('a').innerText;
let imageUrl = products[i].querySelector('.pwimage').querySelector('a').querySelector('img').getAttribute('src');

    let checkBoxhtml = `
    <input type="checkbox" name="products[] value="${id}"">
    <span>Mijn Producten</span>`;

    let label = document.createElement('label');
    label.className = 'ctaButton checkbox unselected';
    label.innerHTML = checkBoxhtml;
    let itemName = products[i].querySelector('.itemname');
    itemName.appendChild(label);
    
    productsOnPage.push({
        id: id,
        title: title,
        specline: specline,
        price: price,
        imageUrl: imageUrl,
        priceAlert: false,  
    });
    
    //Add an eventlistener to the label button
    label.addEventListener('click', () => {
        if(label.className === 'ctaButton checkbox unselected'){
            addToMPO(id, label);
        }else{
            deleteFromMPO(id, label); 
        }
    })
}



let icon = document.querySelector('.icon.compare');
console.log(icon);
icon.addEventListener('click', () =>{
    //popover.style.display = 'block';
})

console.log(productsOnPage);

let html = `
<div class="wrapper">
<div class="tabbar">
<button class="active button-tab mpo-tab"><span>Mijn Producten(<span class="counter">${mpoCounter}</span>)</span></button>
<button class="inactive button-tab compare-tab"><span>Vergelijk<span>(0)</span</span></button>
</div>
<div class="contentWrapper">
<div style="margin-top: 25px; margin-bottom: 35px; class="topInfo">
<span style="margin-left: 15px;  font-weight: bolder; font-size: 18px;">Mijn Producten(<span class="counter">${mpoCounter}</span>)</span>
<a style="float: right; margin-right: 15px; margin-top: -2px;" class="ctaButton">Nieuwe lijst maken</a>
</div>
<div style="height: auto; margin-bottom: 50px;" class="content"></div>
<div style="text-align: center" class="bottomInfo">
<p style="margin-bottom: 5px; font-size: 12px;"><a href="#"><span>${listCounter}</span> lijsten, met in totaal <span class="counter">${mpoCounter}</span> producten</a></p>
<p style="margin-bottom: 15px; font-size: 18px; font-weight: bolder;">Meer producten toevoegen?</p>
<a class="ctaButton">Bekijk Pricewatch</a>
</div>
</div
</div>
`
let popover = document.createElement('div');
popover.innerHTML = html;
popover.style.zIndex = '200';
popover.style.position = 'fixed';
popover.style.cursor = 'move';
popover.style.top = '50px';
popover.style.left = '550px';
popover.className = 'popupContent';
popover.style.boxShadow = '8px 5px 5px -3px rgba(0,0,0,0.1), 5px 8px 5px -3px rgba(0,0,0,0.1)';


let body = document.querySelector('body');
body.appendChild(popover);

let contentWrapper = popover.querySelector('.contentWrapper');
contentWrapper.style.width = '375px';
contentWrapper.style.height = '700px';
contentWrapper.style.backgroundColor = '#f2f2f2';
contentWrapper.style.borderRadius = '2px';
contentWrapper.style.overflowX = 'hidden';
contentWrapper.style.overflowY = 'hidden';
let content = contentWrapper.querySelector('.content');

//grab tab buttons
let tabbar = popover.querySelector('.tabbar');
tabbar.style.width = '375px';
tabbar.style.height = '50px';
//tabbar.style.backgroundColor = 'white';
tabbar.style.marginBottom = '3px';

let tabButtons = tabbar.querySelectorAll('.button-tab');
let compareTab = tabbar.querySelector('.compare-tab');
let mpoTab = tabbar.querySelector('.mpo-tab');

mpoTab.style.float = 'left';
mpoTab.style.borderTopLeftRadius = '2px';

compareTab.style.float = 'right';
compareTab.style.borderTopRightRadius = '2px';


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

//Create item element for each product and add it to the contentview


function addToMPO(productID, label){
    let item = document.createElement('div');
    item.setAttribute('id', productID);
    item.className = 'productItem';
    item.style.marginBottom = "40px";
    label.classList.remove('unselected');
    label.classList.add('selected');
    console.log('added');
    for(i = 0; i < productsOnPage.length; i++){
       
        if(productsOnPage[i].id == productID){
           let productTitle = productsOnPage[i].title;
           let productImage = productsOnPage[i].imageUrl;
           let productSpecs = productsOnPage[i].specline;
           let productPrice = productsOnPage[i].price;

           //HTML for the list item
           let itemHTML = `
           <div style='height: 80px; margin: 0 auto; width: 355px; left: 0; right: 0; background-color: #E5E5E5; border-radius: 2px;' class='itemWrapper'>
           <span class="closeButton product" style="float: right; margin: 2px;"></span>
           <span class='alert' style="border-radius: 2px; width: 35px; height: 35px; margin-top: 43px; margin-right: -20px; float: right; background-color: #D9D9D9;"></span>
           <span class='alert' style="border-radius: 2px; width: 35px; height: 35px; margin-top: 43px; margin-right: 5px; float: right; background-color: #D9D9D9;"></span>
           <div style='height: 80px; width: 80px; background-color: white; float: left; border-top-left-radius: 2px; border-bottom-left-radius: 2px' class="imageProduct" >
           <img style="background-size: contain; width: 100%;" src='${productImage}'>
           </div>
           <div class='itemInfo'>
           <ul style="list-style-type: none; margin-left: 50px; padding-top: 10px;">
           <li style="max-width: 200px; max-height: 16px; overflow-x: hidden; font-weight: bolder; font-size: 14px; word-wrap: break-word;"><span class='titleProduct'><a>${productTitle}</a></span></li>
           <li style="max-width: 150px;  font-size: 12px; word-wrap: break-word; overflow-x: hidden; margin-top: 5px; max-height: 16px;"> <span class='speclineProduct'><a style="color: #666666;">${productSpecs}</a></span></li>
           <li style="margin-top: 10px; margin-bottom: 10px; font-size: 13px;"><span class='priceProduct'><a>${productPrice}</a></span></li>
           </ul>
           </div>
           <label style="float: right;" class="compare ctaButton unselected checkbox"><input type="checkbox" name="products[]" value="${productID}"><span>vergelijk</span></label>
           </div>
           `;

           productsMPO.push({
            id: productID,
            title: productTitle,
            specline: productSpecs,
            price: productPrice,
            imageUrl: productImage,
            priceAlert: false,  
        });

           item.innerHTML = itemHTML;
           content.appendChild(item);
           updateCounter();
           let deletebtn = item.querySelector('.closeButton');
           deletebtn.addEventListener('click', () => {
           deleteFromMPO(productID, label);
           })
        }else{
            //nothing
        }
    }
    }


function deleteFromMPO(productID, label){
console.log(label)
label.classList.remove('selected');
    label.classList.add('unselected');
    let products = content.querySelectorAll('.productItem');
    for(i = 0; i < products.length; i++){
        if(products[i].getAttribute("id") == productID){
            mpoCounter--; 
            updateCounter();
            content.removeChild(products[i]);
        }else{
            //nothing
        }
    }
}

//Function for updating the counter
function updateCounter(){
    mpoCounter = productsMPO.length();
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


//Hiding the scrollbar
let style = `/* On Chrome */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
/* For Firefox and IE */
.hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}`
function HideScrollbar() {
    var style = document.createElement("style");
    style.innerHTML = `body::-webkit-scrollbar {display: none;}`;
    document.head.appendChild(style);
  }


