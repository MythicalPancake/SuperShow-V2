// 1. Check if the user is logged in
if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';  // Redirect to login if not logged in
}

// 2. Function to log out the user
function logOut() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';  // Redirect to login after logout
}

// 1. Function to handle navigation between tabs
function navigate(tab) {
    const mainContent = document.getElementById('main-content');

    if (tab === 'home') {
        mainContent.innerHTML = '<h1>Welcome, ' + localStorage.getItem('user') + '</h1>';
        mainContent.innerHTML += '<p>Welcome to your Trading Card Collection!</p>';
        displayCollection();
    } else if (tab === 'collection') {
        mainContent.innerHTML = '<h1>Your Collection</h1>';
        displayCollection();
    } else if (tab === 'decks') {
        mainContent.innerHTML = '<h1>Your Decks</h1>';
        displayDecks();
    } else if (tab === 'storages') {
        mainContent.innerHTML = '<h1>Your Storages</h1>';
        displayStorages();
    }
}

// 2. Function to display the collection of cards with image upload and category
function displayCollection() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to view your collection.");
        return;
    }

    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];

    const collectionContainer = document.getElementById('main-content');
    collectionContainer.innerHTML = '<h1>Your Collection</h1>';

    // Add a button to add new cards
    collectionContainer.innerHTML += '<button onclick="addCard()">Add New Card</button>';

    collection.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.textContent = `Card ID: ${card.id}, Name: ${card.name}, Category: ${card.category}`;
        
        // Display the image if it exists
        if (card.image) {
            const imgElement = document.createElement('img');
            imgElement.src = card.image;
            imgElement.alt = 'Card Image';
            imgElement.style.width = '100px';  // You can adjust the size
            imgElement.style.height = 'auto';
            cardElement.appendChild(imgElement);
        }

        // Add a remove button to each card
        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeCard(card.id);
        cardElement.appendChild(removeButton);

        collectionContainer.appendChild(cardElement);
    });
}

// 3. Function to add a new card (with image and category selection)
function addCard() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to add cards.");
        return;
    }

    // Get the card details from the user
    const name = prompt("Enter the name of the card:");
    const category = prompt("Enter the category of the card:");
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';

    imageInput.onchange = (event) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            const newCard = {
                id: Date.now(),  // Use the current timestamp as a unique ID
                name: name,
                category: category,
                image: imageUrl  // Store the image URL
            };

            let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
            collection.push(newCard);
            localStorage.setItem(user + '_collection', JSON.stringify(collection));

            displayCollection();  // Refresh the collection display
        };
        reader.readAsDataURL(event.target.files[0]);  // Convert the image to base64
    };

    // Append the input element to the page to let the user select an image
    document.body.appendChild(imageInput);
}

// 4. Function to remove a card
function removeCard(cardId) {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to remove cards.");
        return;
    }

    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    collection = collection.filter(card => card.id !== cardId);  // Remove card with matching ID
    localStorage.setItem(user + '_collection', JSON.stringify(collection));

    displayCollection();  // Refresh the collection display
}

// 5. Function to display the user's decks (allow adding cards to decks)
function displayDecks() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to view your decks.");
        return;
    }

    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];

    const decksContainer = document.getElementById('main-content');
    decksContainer.innerHTML = '<h1>Your Decks</h1>';

    decks.forEach(deck => {
        const deckElement = document.createElement('div');
        deckElement.textContent = `Deck Name: ${deck.name}`;

        // Add button to edit deck (add cards)
        const editButton = document.createElement('button');
        editButton.textContent = "Edit Deck";
        editButton.onclick = () => editDeck(deck);
        deckElement.appendChild(editButton);

        decksContainer.appendChild(deckElement);
    });
}

// 6. Function to edit a deck (add cards to the deck)
function editDeck(deck) {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to edit your decks.");
        return;
    }

    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    let deckCards = deck.cards || [];

    const deckEditContainer = document.getElementById('main-content');
    deckEditContainer.innerHTML = '<h1>Edit Deck: ' + deck.name + '</h1>';

    // Display cards in the collection and allow selecting them for the deck
    collection.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.textContent = `Card Name: ${card.name}, Category: ${card.category}`;
        
        // Button to add card to the deck
        const addButton = document.createElement('button');
        addButton.textContent = "Add to Deck";
        addButton.onclick = () => {
            deckCards.push(card);
            localStorage.setItem(user + '_decks', JSON.stringify([deck]));  // Update deck in localStorage
        };
        cardElement.appendChild(addButton);

        deckEditContainer.appendChild(cardElement);
    });
}

// 7. Function to display the user's storages (for demonstration purposes)
function displayStorages() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to view your storages.");
        return;
    }

    let storages = JSON.parse(localStorage.getItem(user + '_storages')) || [];

    const storagesContainer = document.getElementById('main-content');
    storagesContainer.innerHTML = '<h1>Your Storages</h1>';

    storages.forEach(storage => {
        const storageElement = document.createElement('div');
        storageElement.textContent = `Storage Name: ${storage.name}`;
        storagesContainer.appendChild(storageElement);
    });
}

// Initialize the page to load the collection view by default
navigate('home');
