document.getElementById('showSignup').addEventListener('click', function() {
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
});

document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
});

function generateCustomerId() {
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    const lastCustomer = customers[customers.length - 1];

    if (lastCustomer && typeof lastCustomer.id === 'string') {
        const lastIdNumber = parseInt(lastCustomer.id.slice(1));
        return 'C' + (lastIdNumber + 1).toString().padStart(4, '0');
    } else {
        return 'C0001';
    }
}

document.getElementById('btnSignup').addEventListener('click', function() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dob = document.getElementById('dob').value;
    const age = document.getElementById('age').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const customers = JSON.parse(localStorage.getItem('customers')) || [];

    const isEmailTaken = customers.some(cust => cust.email === email);

    if (isEmailTaken) {
        alert('This email is already registered. Please use a different email.');
        return;
    }

    const customer = {
        id: generateCustomerId(),
        firstName,
        lastName,
        dob,
        age,
        city,
        postalCode,
        email,
        password
    };

    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));

    alert('Signup successful! You can now login.');
    document.getElementById('formSignup').reset();
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
});

document.getElementById('btnLogin').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const customers = JSON.parse(localStorage.getItem('customers')) || [];

    const customer = customers.find(cust => cust.email === email && cust.password === password);

    if (customer) {
        alert(`Welcome back, ${customer.firstName}!`);

        localStorage.setItem('currentCustomer', JSON.stringify(customer));

        window.location.href = 'menu.html';
    } else {
        alert('Invalid email or password!');
    }
});

