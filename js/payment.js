document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalDiscount = cart.reduce((total, item) => {
        const discountAmount = (item.price * item.quantity) * (item.discount / 100 || 0);
        return total + discountAmount;
    }, 0);
    const finalTotal = subTotal - totalDiscount;

    document.getElementById('sub-total').textContent = subTotal.toFixed(2);
    document.getElementById('discount').textContent = totalDiscount.toFixed(2);
    document.getElementById('total-price').textContent = finalTotal.toFixed(2);

    const paymentForm = document.getElementById('payment-form');
    
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerId = Date.now();
        const customerDetails = {
            id: customerId,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            city: document.getElementById('city').value,
            street: document.getElementById('street').value,
            postalCode: document.getElementById('postalCode').value,
            password: document.getElementById('password').value
        };

        console.log("Customer Details: ", customerDetails);

        let customers = JSON.parse(localStorage.getItem('customers')) || [];
        customers.push(customerDetails);
        localStorage.setItem('customers', JSON.stringify(customers));

        if (document.getElementById('saveCardDetails').checked) {
            const cardDetails = {
                customerId: customerId,
                cardName: document.getElementById('cardName').value,
                cardNumber: document.getElementById('cardNumber').value,
                expiryDate: document.getElementById('expiryDate').value,
                cvc: document.getElementById('cvc').value
            };

            console.log("Card Details: ", cardDetails);

            let cards = JSON.parse(localStorage.getItem('cards')) || [];
            cards.push(cardDetails);
            localStorage.setItem('cards', JSON.stringify(cards));
        }

        alert('Payment Successful!');
    });

    // Card Details Verification
    const cardNumberInput = document.getElementById('cardNumber');
    const cardIcon = document.getElementById('card-icon');

    const detectCardType = (number) => {
        const cardNumber = number.replace(/\D/g, '');

        if (/^4/.test(cardNumber)) {
            return 'visa';
        }

        if (/^5[1-5]/.test(cardNumber)) {
            return 'master';
        }

        if (/^3[47]/.test(cardNumber)) {
            return 'american-express';
        }

        return 'default';
    };

    cardNumberInput.addEventListener('input', (e) => {
        const cardType = detectCardType(e.target.value);

        switch (cardType) {
            case 'visa':
                cardIcon.src = 'assets/images/cards/visa.png';
                break;
            case 'master':
                cardIcon.src = 'assets/images/cards/master.png';
                break;
            case 'american-express':
                cardIcon.src = 'assets/images/cards/american-express.png';
                break;
            default:
                cardIcon.src = 'assets/images/cards/default.png';
        }
    });

    // Month and Year Verification
    const expiryDateInput = document.getElementById('expiryDate');
    expiryDateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            const month = value.substring(0, 2);
            const year = value.substring(2, 4);

            if (parseInt(month, 10) > 12 || parseInt(month, 10) === 0) {
                alert('Please enter a valid month between 01 and 12.');
                e.target.value = '';
                return;
            }

            if (value.length > 2) {
                e.target.value = `${month}/${year}`;
            } else {
                e.target.value = month;
            }
        }
    });

    expiryDateInput.addEventListener('blur', (e) => {
        const [month, year] = e.target.value.split('/');

        if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
            alert('Please enter a valid month between 01 and 12.');
            e.target.value = '';
        }

        const currentYear = new Date().getFullYear() % 100;
        if (year && parseInt(year, 10) < currentYear) {
            alert('The expiry year cannot be in the past.');
            e.target.value = '';
        }
    });
});

