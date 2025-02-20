// Redirect to login if not logged in
if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';
}

function logOut() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Global categories
const categories = ["Competitors", "Entrances", ...Array.from({ length: 30 }, (_, i) => (i + 1).toString())];

function navigate(tab) {
    const mainContent = document.getElementById('main-content');
    if (tab === 'collection') displayCollection();
    else if (tab === 'decks') displayDecks();
    else mainContent.innerHTML = `<h1>Welcome, ${localStorage.getItem('user')}</h1><p>Manage your trading card collection!</p>`;
}

function displayCollection() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Your Collection</h1>
        <input type="file" id="cardImage" accept="image/*">
        <input type="text" id="cardName" placeholder="Enter card name">
        <button onclick="addCard()">Add Card</button>
        <h2>Categories</h2>
        <div id="categories">${categories.map(cat => `<button onclick="filterCategory('${cat}')">${cat}</button>`).join("")}</div>
        <ul id="collection" class="draggable-list"></ul>
    `;
    loadCollection();
}

function addCard() {
    const user = localStorage.getItem('user');
    const name = document.getElementById('cardName').value;
    const file = document.getElementById('cardImage').files[0];

    if (!name || !file) return alert("Please provide both name and image.");
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newCard = {
            id: Date.now(),
            name,
            image: e.target.result,
            categories: []
        };
        let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
        collection.push(newCard);
        localStorage.setItem(user + '_collection', JSON.stringify(collection));
        loadCollection();
    };
    reader.readAsDataURL(file);
}

function loadCollection() {
    const user = localStorage.getItem('user');
    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    const collectionList = document.getElementById('collection');
    collectionList.innerHTML = "";
    
    collection.forEach(card => {
        const cardElement = document.createElement('li');
        cardElement.id = `card-${card.id}`; // Set the id attribute
        cardElement.draggable = true; // Make the element draggable
        cardElement.innerHTML = `
            <img src="${card.image}" width="100"><br>
            <strong>${card.name}</strong>
            <br>
            Categories: ${card.categories.join(", ") || "None"}
            <br>
            <button onclick="assignCategory(${card.id})">Assign Category</button>
            <button onclick="removeCard(${card.id})">Remove</button>
        `;
        collectionList.appendChild(cardElement);
    });

    makeListDraggable(); // Call makeListDraggable after loading the collection
}

function assignCategory(cardId) {
    const category = prompt("Enter category (Competitors, Entrances, 1-30):");
    if (!categories.includes(category)) return alert("Invalid category.");
    
    let user = localStorage.getItem('user');
    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    let card = collection.find(c => c.id === cardId);
    if (!card.categories.includes(category)) card.categories.push(category);
    
    localStorage.setItem(user + '_collection', JSON.stringify(collection));
    loadCollection();
}

function removeCard(cardId) {
    let user = localStorage.getItem('user');
    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    collection = collection.filter(c => c.id !== cardId);
    localStorage.setItem(user + '_collection', JSON.stringify(collection));
    loadCollection();
}

// Deck Building
function displayDecks() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Your Decks</h1>
        <input type="text" id="deckName" placeholder="Enter deck name">
        <button onclick="createDeck()">Create Deck</button>
        <ul id="deckList"></ul>
    `;
    loadDecks();
}

function createDeck() {
    let user = localStorage.getItem('user');
    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];
    let deckName = document.getElementById('deckName').value;

    if (!deckName || decks.find(d => d.name === deckName)) return alert("Invalid or duplicate deck name.");

    decks.push({ name: deckName, cards: [] });
    localStorage.setItem(user + '_decks', JSON.stringify(decks));
    loadDecks();
}

function loadDecks() {
    let user = localStorage.getItem('user');
    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];
    let deckList = document.getElementById('deckList');
    deckList.innerHTML = "";
    
    decks.forEach(deck => {
        let deckItem = document.createElement('li');
        deckItem.innerHTML = `
            <strong>${deck.name}</strong>
            <button onclick="editDeck('${deck.name}')">Edit</button>
            <button onclick="deleteDeck('${deck.name}')">Delete</button>
        `;
        deckList.appendChild(deckItem);
    });
}

function editDeck(deckName) {
    let user = localStorage.getItem('user');
    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];
    let deck = decks.find(d => d.name === deckName);
    
    if (!deck) return;

    let cardName = prompt("Enter card name to add:");
    let userCollection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    let card = userCollection.find(c => c.name === cardName);

    if (!card) return alert("Card not found.");
    
    deck.cards.push(card);
    localStorage.setItem(user + '_decks', JSON.stringify(decks));
}

function deleteDeck(deckName) {
    let user = localStorage.getItem('user');
    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];
    decks = decks.filter(d => d.name !== deckName);
    localStorage.setItem(user + '_decks', JSON.stringify(decks));
    loadDecks();
}
function makeListDraggable() {
    const list = document.getElementById('collection');
    const draggables = list.querySelectorAll('li');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragover', dragOver);
        draggable.addEventListener('drop', dropCard);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dropCard(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId);
    // Logic to move the card in the collection
}

navigate('home');
