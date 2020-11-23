//JSON data that gets all the products when the page loads
let productsOnPage = [
  ];

let mpoCounter = 0;
let compareCounter = 0;

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
<button class="active button-tab mpo-tab"><span>Mijn Producten<span class="counter">(${mpoCounter})</span></span></button>
<button class="inactive button-tab compare-tab"><span>Vergelijk<span>(0)</span</span></button>
</div>
<div class="contentWrapper">
<div class="content"></div>
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

let contentView = popover.querySelector('.content');
contentView.style.width = '375px';
contentView.style.height = '715px';
contentView.style.backgroundColor = '#f2f2f2';
contentView.style.borderRadius = '2px';
contentView.style.overflowX = 'scroll';

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

           item.innerHTML = itemHTML;
           contentView.appendChild(item);
           mpoCounter++;
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
    let products = contentView.querySelectorAll('.productItem');
    for(i = 0; i < products.length; i++){
        if(products[i].getAttribute("id") == productID){
            mpoCounter--; 
            updateCounter();
            contentView.removeChild(products[i]);
        }else{
            //nothing
        }
    }
}

//Function for updating the counter
function updateCounter(){

    let counter = tabbar.querySelector('.counter');
    let parent = counter.parentElement;

    parent.removeChild(counter);
    let newCounter = document.createElement('span');
    newCounter.className = 'counter';
    newCounter.innerText = `(${mpoCounter})`;

    parent.appendChild(newCounter);

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


