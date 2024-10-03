const customerDetails = JSON.parse(localStorage.getItem('customers')) || [];
const cardDetails = JSON.parse(localStorage.getItem('cards')) || [];

const loginSection = document.getElementById('login-section');
const customerSection = document.getElementById('customer-section');
const loginForm = document.getElementById('loginForm');

let loggedInCustomer = null;

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const customer = customerDetails.find(cust => cust.email === email && cust.password === password);

    if (customer) {
        loggedInCustomer = customer;
        loginSection.classList.add('d-none');
        customerSection.classList.remove('d-none');
        displayCustomerDetails();
        displayCardDetails();
    } else {
        alert('Invalid email or password.');
    }
});

function displayCustomerDetails() {
    if (loggedInCustomer) {
        document.getElementById('firstName').textContent = loggedInCustomer.firstName;
        document.getElementById('lastName').textContent = loggedInCustomer.lastName;
        document.getElementById('email').textContent = loggedInCustomer.email;
        document.getElementById('city').textContent = loggedInCustomer.city;
        document.getElementById('street').textContent = loggedInCustomer.street;
        document.getElementById('postalCode').textContent = loggedInCustomer.postalCode;
    }
}

document.getElementById('editDetailsBtn').addEventListener('click', () => {
    if (loggedInCustomer) {
        const updatedFirstName = prompt("Edit First Name:", loggedInCustomer.firstName);
        const updatedLastName = prompt("Edit Last Name:", loggedInCustomer.lastName);
        const updatedCity = prompt("Edit City:", loggedInCustomer.city);
        const updatedStreet = prompt("Edit Street:", loggedInCustomer.street);
        const updatedPostalCode = prompt("Edit Postal Code:", loggedInCustomer.postalCode);

        if (updatedFirstName) loggedInCustomer.firstName = updatedFirstName;
        if (updatedLastName) loggedInCustomer.lastName = updatedLastName;
        if (updatedCity) loggedInCustomer.city = updatedCity;
        if (updatedStreet) loggedInCustomer.street = updatedStreet;
        if (updatedPostalCode) loggedInCustomer.postalCode = updatedPostalCode;

        const customerIndex = customerDetails.findIndex(cust => cust.id === loggedInCustomer.id);
        if (customerIndex !== -1) {
            customerDetails[customerIndex] = loggedInCustomer;
            localStorage.setItem('customers', JSON.stringify(customerDetails));
        }

        displayCustomerDetails();
    }
});

function displayCardDetails() {
    const cardDetailsSection = document.getElementById('card-details-section');
    cardDetailsSection.innerHTML = '';

    const customerCards = cardDetails.filter(card => card.customerId === loggedInCustomer.id);

    if (customerCards.length > 0) {
        customerCards.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('mb-3', 'p-3', 'bg-secondary', 'rounded');
            cardElement.innerHTML = `
                <p><strong>Card Name:</strong> ${card.cardName}</p>
                <p><strong>Card Number:</strong> ${card.cardNumber}</p>
                <p><strong>Expiry Date:</strong> ${card.expiryDate}</p>
                <p><strong>CVC:</strong> ${card.cvc}</p>
                <button class="btn btn-danger btn-sm" onclick="removeCard(${card.id})">Remove Card</button>
            `;
            cardDetailsSection.appendChild(cardElement);
        });
    } else {
        cardDetailsSection.innerHTML = "<p>No card details saved.</p>";
    }
}

function removeCard(cardId) {
    if (confirm("Are you sure you want to remove this card?")) {
        const cardIndex = cardDetails.findIndex(card => card.id === cardId && card.customerId === loggedInCustomer.id);
        if (cardIndex !== -1) {
            cardDetails.splice(cardIndex, 1);
            localStorage.setItem('cards', JSON.stringify(cardDetails));
            displayCardDetails();
        }
    }
}

document.getElementById('addCardDetailsBtn').addEventListener('click', () => {
    const newCardName = prompt("Enter Card Name:");
    const newCardNumber = prompt("Enter Card Number:");
    const newExpiryDate = prompt("Enter Expiry Date (MM/YY):");
    const newCVC = prompt("Enter CVC:");

    if (newCardName && newCardNumber && newExpiryDate && newCVC) {
        const newCard = {
            id: Date.now(),
            customerId: loggedInCustomer.id,
            cardName: newCardName,
            cardNumber: newCardNumber,
            expiryDate: newExpiryDate,
            cvc: newCVC
        };

        cardDetails.push(newCard);
        localStorage.setItem('cards', JSON.stringify(cardDetails));
        displayCardDetails();
    }
});

document.getElementById('signOutBtn').addEventListener('click', () => {
    loggedInCustomer = null;
    location.reload();
});

const orders = JSON.parse(localStorage.getItem('orders')) || [];
const reviews = JSON.parse(localStorage.getItem('reviews')) || [];

function displayBoughtItems() {
    const customerOrders = orders.filter(order => order.customerId === loggedInCustomer.id);
    const boughtItemsDiv = document.getElementById('bought-items');
    
    if (customerOrders.length === 0) {
        boughtItemsDiv.innerHTML = "<p>You haven't purchased anything yet.</p>";
        return;
    }
    
    customerOrders.forEach(order => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <h5>Item: ${order.itemName}</h5>
            <p>Price: ${order.price} LKR</p>
        `;
        boughtItemsDiv.appendChild(itemDiv);
    });

    const itemSelect = document.getElementById('itemSelect');
    customerOrders.forEach(order => {
        const option = document.createElement('option');
        option.value = order.itemId;
        option.textContent = order.itemName;
        itemSelect.appendChild(option);
    });
}

function handleReviewSubmission(e) {
    e.preventDefault();

    const itemId = document.getElementById('itemSelect').value;
    const reviewText = document.getElementById('reviewText').value;

    const newReview = {
        customerId: loggedInCustomer.id,
        itemId: itemId,
        review: reviewText
    };

    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    alert('Review submitted successfully!');
    document.getElementById('reviewForm').reset();
}

document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmission);
displayBoughtItems();
