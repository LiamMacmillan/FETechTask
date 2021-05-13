$(document).ready(function() {

// --------
// PRODUCTS 🛍️
// --------

let itemId = 0;

// Define products for sale 
const items = [
{
    id: itemId++,
    name: "Goku POP",
    imageURL: "images/goku.jpg",
    code: "GOKU",
    price: 5,
    finalPrice: 2.5, // always 50% off (2-for-1)
    count: 0
}, 
{
    id: itemId++,
    name: "Naruto POP",
    imageURL: "images/naruto.jpg",
    code: "NARU",
    price: 20,
    finalPrice: 20,
    count: 0
}, 
{
    id: itemId++,
    name: "Luffy POP",
    imageURL: "images/luffy.jpg",
    code: "LUF",
    price: 7.5,
    finalPrice: 7.5,
    count: 0
}
]

// -------------------
// CHECK FOR DISCOUNTS 💸
// -------------------

// Check if bulk discount should be applied
let checkBulkDiscount = (itemId, itemCode, itemCount) => {

    if(itemCode === "NARU" && itemCount >= 3) { // discount applies, set price to 19€/item
        items[itemId].finalPrice = 19;
    }
    else if (itemCode === "NARU" && itemCount < 3) { // discount does not apply, set price to 20€/item
        items[itemId].finalPrice = 20;
    }
}

// Check if item code is "GOKU", if true then the 2-for-1 promotion should be applied (set to increments of 2)
let checkTwoForOnePromo = (itemId, itemCode, itemCount, addOrSubtract) => {

    if(itemCode === "GOKU" && addOrSubtract === "+") { // add free Goku 
        items[itemId].count++;
    }
    else if(itemCode === "GOKU" && addOrSubtract === "-") { // remove free Goku
        items[itemId].count--;
    }
}

// -----------------
// CALCULATE PRICING 🧮
// -----------------

// Calculate 2-for-1 discount (GOKU items)
let twoForOne = () => {
    let x = (items[0].finalPrice * items[0].count);
    return x > 1 ? x : false;
}

// Calculate bulk discount (NARU items)
let discountNaru = () => {
    let x = items[1].count;
    return x >= 3 ? x : false;
}

// Get total cost
let calcTotalCost = () => {
    return items.reduce((accum, item) => accum + (item.price * item.count), 0);
}

// Get total final cost (includes discounts) 
let calcTotalFinalCost = () => {
    return items.reduce((accum, item) => accum + (item.finalPrice * item.count), 0);
}

// ------------
// UPDATE VIEWS 🪟
// ------------

// Update product table view
let updateProductTable = (arr) => {  	

    $("#product-table #table-body").html(""); 

    $.each(arr, function(index, item) {  
        $("#product-table #table-body").append(
            `<div class="product row" data-id="${item.id}" data-name="${item.name}" data-code="${item.code}" data-price="${item.price}" data-count="${item.count}">
                <div class="product-details cell">
                    <div class="product-image" style="background-image:url('${item.imageURL}')"></div>
                    <div class="product-naming">
                        <div class="name">${item.name}</div>
                        <div class="code">Product code <span>${item.code}</span></div>
                    </div>
                </div>
                <div class="product-quantity cell">
                    <button class="change-quantity decrease-quantity"><i class="icn fas fa-minus"></i></button>
                    <input class="input-count" type="number" value="${item.count}" onClick="this.select();" onkeypress="return onlyNumberKey(event)">
                    <button class="change-quantity increase-quantity"><i class="icn fas fa-plus"></i></button>
                </div>
                <div class="product-price cell"><span>${item.price}</span>&nbsp;€</div>
                <div class="product-total-price cell"><span>${item.price * item.count}</span>&nbsp;€</div>
            </div>`
        );
    });
}

// Update product table on DOM load
updateProductTable(items);

// Update order summary view
let updateOrderSummary = () => {

    // Get number of items in the cart
    let counter = items.reduce((accum, item) => accum + item.count, 0);

    // Get total cost
    let totalCost = calcTotalCost();

    // Get total (final) cost
    let totalFinalCost = calcTotalFinalCost();
        
    // Check if 2-for-1 discount is active. If true, update HTML.
    if(twoForOne()) {
        $("#order-summary #discount-2for1").removeClass("hide");
        $("#order-summary #discount-2for1 .savings span").html(twoForOne());
    } 
    else {
        $("#order-summary #discount-2for1").addClass("hide");
    }
        
    // Check if bulk discount is active. If true, update HTML.
    if(discountNaru()) {
        $("#order-summary #discount-naru").removeClass("hide");
        $("#order-summary #discount-naru .savings span").html(discountNaru());
    } 
    else {
        $("#order-summary #discount-naru").addClass("hide");
    }

    // Update all other views
    $("#order-summary #item-summary .no-of-items span").html(counter);
    $("#order-summary #item-summary .total-cost span").html(totalCost.toFixed(2));
    $("#checkout-container #total-final-cost span").html(totalFinalCost.toFixed(2));

}

// --------------------
// ADD & REMOVE TO CART 🛒
// --------------------

// Add/remove number of items in shopping cart on input change ➕/➖
$(document).on("change", ".product input.input-count", function() {

    // Ensure input value isn't NULL in order to avoid NaN issues
    if($(this).val() === "") {
        $(this).val(0);
    }

    let itemId = $(this).parent().parent().data("id");
    let itemCode = $(this).parent().parent().data("code");
    let itemCount = parseInt($(this).val());

    // If item code is GOKU then set increments to 2 
    if(itemCode === "GOKU") {
        itemCount = 2 * Math.round(itemCount / 2); 
    }
                
    // Set count based on input value
    items[itemId].count = itemCount;

    // Apply bulk discount if conditions are met
    checkBulkDiscount(itemId, itemCode, itemCount);

    // Update views
    updateProductTable(items);
    updateOrderSummary();
        
    // Log to console
    console.log(items);

});

// Add item to shopping cart ➕
$(document).on("click", ".product .increase-quantity", function() {

    let itemId = $(this).parent().parent().data("id");
    let itemCode = $(this).parent().parent().data("code");
        
    // Update count
    items[itemId].count++;
    let itemCount = items[itemId].count;

    // Apply 2-for-1 promo if conditions are met
    checkTwoForOnePromo(itemId, itemCode, itemCount, "+");

    // Apply bulk discount if conditions are met
    checkBulkDiscount(itemId, itemCode, itemCount);

    // Update views
    updateProductTable(items);
    updateOrderSummary();
        
    // Log to console
    console.log(items);
}); 

// Remove item from shopping cart ➖
$(document).on("click", ".product .decrease-quantity", function() {

    let itemId = $(this).parent().parent().data("id");
    let itemCode = $(this).parent().parent().data("code");
    let itemCount = items[itemId].count;

    // Ensure item count is NOT set to zero before performing any subtractions
    if(itemCount !== 0) {

        // Update count
        items[itemId].count--;
        itemCount = items[itemId].count;

        // Apply 2-for-1 promo if conditions are met
        checkTwoForOnePromo(itemId, itemCode, itemCount, "-");

        // Apply bulk discount if conditions are met
        checkBulkDiscount(itemId, itemCode, itemCount);
    }
        
    // Update views
    updateProductTable(items);
    updateOrderSummary();
        
    // Log to console
    console.log(items);
}); 

});

// ----
// MISC 🚀
// ----

// Only allow numerical entries on number inputs
function onlyNumberKey(evt) {

    let ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 32 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

