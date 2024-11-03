let turnCount = 0;
let coins = 0;
let victoryPoints = 0;
let deck = ["1pt", "1pt", "2pt", "1coin", "1coin", "1coin", "2coin"];
let discardMode = false;

const availableCards = [
    { name: "2coin", cost: 1, type: "coin" },
    { name: "3coin", cost: 5, type: "coin" },
    { name: "4coin", cost: 10, type: "coin" },
    { name: "6coin", cost: 15, type: "coin" },
    { name: "3pt", cost: 3, type: "point" },
    { name: "5pt", cost: 10, type: "point" },
    { name: "7pt", cost: 15, type: "point" },
    { name: "10pt", cost: 30, type: "point" },
    { name: "廃棄", cost: 5, type: "discard" }
];

function updateUI() {
    document.getElementById("turn-count").textContent = turnCount;
    document.getElementById("coins").textContent = coins;
    document.getElementById("victory-points").textContent = victoryPoints;
    
    const deckContainer = document.getElementById("deck");
    deckContainer.innerHTML = "";
    deck.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = `card ${card.includes("pt") ? "point" : "coin"}`;
        cardElement.textContent = card;

        // 廃棄モード時のみ廃棄可能
        if (discardMode) {
            cardElement.onclick = () => discardCard(index);
        }

        deckContainer.appendChild(cardElement);
    });

    const availableCardsContainer = document.getElementById("available-cards");
    availableCardsContainer.innerHTML = "";
    availableCards.forEach((card, index) => {
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "card-wrapper";

        const cardElement = document.createElement("div");
        cardElement.className = `card ${card.type}`;
        cardElement.textContent = `${card.name}`;
        cardElement.onclick = () => markForPurchase(index);

        const priceLabel = document.createElement("div");
        priceLabel.className = "price-label";
        priceLabel.textContent = `価格: ${card.cost}コイン`;

        cardWrapper.appendChild(cardElement);
        cardWrapper.appendChild(priceLabel);
        availableCardsContainer.appendChild(cardWrapper);
    });
}

function markForPurchase(index) {
    const card = availableCards[index];
    
    if (coins >= card.cost) {
        if (card.type === "discard") {
            if (confirm(`廃棄を${card.cost}コインで購入しますか？`)) {
                coins -= card.cost;
                discardMode = true; // 廃棄モードに切り替え
                alert("廃棄モードです。廃棄したいカードを選択してください。");
            }
        } else {
            if (confirm(`${card.name}を${card.cost}コインで購入しますか？`)) {
                coins -= card.cost;
                deck.push(card.name);
                turnCount++;
            }
        }
        updateUI();
    } else {
        alert("コインが足りません！");
    }
}

function discardCard(index) {
    if (confirm(`${deck[index]}を廃棄しますか？`)) {
        deck.splice(index, 1);
        discardMode = false; // 廃棄モード解除
        alert("カードを廃棄しました。");
        turnCount++;
        updateUI();
    }
}

function challenge() {
    turnCount++;
    if (deck.length === 0) {
        alert("山札が空です！");
        return;
    }
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    const resultPopup = document.getElementById("result");
    
    if (randomCard.includes("pt")) {
        const points = parseInt(randomCard.replace("pt", ""));
        victoryPoints += points;
        resultPopup.textContent = `${points}点の勝利点カードを引きました！`;
    } else if (randomCard.includes("coin")) {
        const coinAmount = parseInt(randomCard.replace("coin", ""));
        coins += coinAmount;
        resultPopup.textContent = `${coinAmount}コインのカードを引きました！`;
    }
    
    resultPopup.classList.add("visible");
    setTimeout(() => resultPopup.classList.remove("visible"), 2000);
    updateUI();
}

// 初期UIの表示
updateUI();
