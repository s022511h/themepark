let total = 0.00;  
let cartItems = [];  
let userEmail = '';  

function fetchUserEmail() {
    fetch('/api/userinfo', {
        credentials: 'include' 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        userEmail = data.email;
        console.log('User email fetched:', userEmail);
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
    });
}

function fetchOrdersAndTickets() {
    fetch('/api/orders', { credentials: 'include' })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    })
    .then(orders => {
        const ordersElement = document.querySelector('.tickets-section');
        ordersElement.innerHTML = '<h2>Your Tickets</h2>';
        orders.forEach(order => {
            ordersElement.innerHTML += `<p>${order.date} - ${order.items.map(item => item.description).join(", ")}</p>`;
        });
    })
    .catch(error => console.error('Error fetching orders:', error));

    const today = new Date().toISOString().slice(0, 10);
    fetch(`/api/tickets?date=${today}`, { credentials: 'include' })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tickets');
        return response.json();
    })
    .then(tickets => {
        const todayTicketsElement = document.querySelector('.today-ticket-section');
        todayTicketsElement.innerHTML = '<h2>Today\'s Ticket</h2>';
        tickets.forEach(ticket => {
            todayTicketsElement.innerHTML += `<p>${ticket.description}</p>`;
        });
    })
    .catch(error => console.error('Error fetching today\'s tickets:', error));
}


document.addEventListener('DOMContentLoaded', () => {
    fetchUserEmail();
    updateCartTotal();
    fetchOrdersAndTickets();
});


function updateCartTotal() {
    total = cartItems.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total-price').textContent = `Total Price: £${total.toFixed(2)}`;
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = ''; 
    cartItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.description}: £${item.price.toFixed(2)}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeItem(index);
        listItem.appendChild(removeButton);
        cartList.appendChild(listItem);
    });
}

function addTicketToCart() {
    const numberOfTickets = parseInt(document.getElementById('tickets').value, 10);
    const ticketDate = document.getElementById('ticketDate').value; 

    
    if (!ticketDate) {
        alert("Please select a date for your tickets.");
        return;
    }

    const ticketPrice = 20 * numberOfTickets; 
    cartItems.push({ description: `${numberOfTickets} Ticket(s) for ${ticketDate}`, price: ticketPrice, date: ticketDate });
    updateCartTotal();
}

function addFastTrack(ticketId, rideId, fastTrackPrice) {
    const ticketDate = document.getElementById('ticketDate').value; 

    
    if (!ticketDate) {
        alert("Please select a date before adding Fast Track options.");
        return;
    }

    if (!ticketId || !rideId) {
        console.error('Invalid ticketId or rideId:', {ticketId, rideId});
        alert("Invalid operation: Ticket or Ride not specified correctly.");
        return; 
    }

    fetch(`/api/tickets/${ticketId}/fast-track/${rideId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price: fastTrackPrice, date: ticketDate }) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Fast-track ride added:', data);
        const itemDescription = `Fast Track for ${data.rideName}`; 
        cartItems.push({
            description: itemDescription,
            price: parseFloat(fastTrackPrice),
            date: ticketDate
        });
        updateCartTotal();
    })
    .catch(error => {
        console.error('Error adding fast track ride:', error);
        alert("Failed to add Fast Track. Please try again.");
    });
}




function removeItem(index) {
    cartItems.splice(index, 1);
    updateCartTotal();
}

function checkout() {
    if (cartItems.length === 0) {
        alert('No items in the cart to checkout!');
        return;
    }

    if (!userEmail) {
        alert("Fetching user details, please try again shortly.");
        fetchUserEmail();
        return;
    }

    const dates = cartItems.map(item => item.date).filter(date => date).join(", ");
    const orderSummary = cartItems.map(item => `${item.description} - £${item.price.toFixed(2)}`).join("\n");
    const orderMessage = `Confirm Your Order:\nEmail: ${userEmail}\nDates: ${dates}\nItems:\n${orderSummary}`;

    if (!confirm(orderMessage)) {
        alert('Checkout canceled!');
        return;
    }

    fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: cartItems }),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to checkout');
        }
        return response.json();
    })
    .then(data => {
        alert('Checkout successful!');
        console.log('Checkout response:', data);
        cartItems = [];
        updateCartTotal();
    })
    .catch(error => {
        console.error('Error during checkout:', error);
        alert('Checkout failed: ' + error.message);
    });
}

function showModalWithOrderDetails() {
    if (cartItems.length === 0) {
        alert('No items in the cart to checkout!');
        return;
    }

    const orderDetails = cartItems.map(item => `${item.description} - £${item.price.toFixed(2)}`).join("<br>");
    document.getElementById('orderDetails').innerHTML = orderDetails;

    document.getElementById('confirmationModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

function finalizeCheckout() {
    closeModal();

}
