'strict';

////////////////////////////// DECLARATIONS //////////////////////////////

//  DECLARATIONS OF QUERY SELECTORS
const dealBtn = document.querySelector('.btn-deal');
const hitBtn = document.querySelector('.btn-hit');
const standBtn = document.querySelector('.btn-stand');

const popUpEl = document.querySelector('.pop-up-box');
const popUpText = document.querySelector('.pop-up-message');

const dealerScoreEl = document.querySelector('.dealer-score');
const dealerScoreText = document.querySelector('.dealer-count');
const playerScoreEl = document.querySelector('.player-score');
const playerScoreText = document.querySelector('.player-count');

const playerMoneyEl = document.querySelector('.player-money-amount');
const dealerMoneyEl = document.querySelector('.dealer-money-amount');
const chip5 = document.querySelector('.btn-5');
const chip25 = document.querySelector('.btn-25');
const chip100 = document.querySelector('.btn-100');
const chip500 = document.querySelector('.btn-500');
const chip1000 = document.querySelector('.btn-1000');
const betBox = document.querySelector('.bet-box');
const betAmountText = document.querySelector('.bet-amount');

// DECK SET UP
const deckInOrder = [
  ['SPADE', 1],
  ['SPADE', 2],
  ['SPADE', 3],
  ['SPADE', 4],
  ['SPADE', 6],
  ['SPADE', 7],
  ['SPADE', 5],
  ['SPADE', 8],
  ['SPADE', 9],
  ['SPADE', 10],
  ['SPADE', 11],
  ['SPADE', 12],
  ['SPADE', 13],
  ['DIAMOND', 1],
  ['DIAMOND', 2],
  ['DIAMOND', 3],
  ['DIAMOND', 4],
  ['DIAMOND', 5],
  ['DIAMOND', 6],
  ['DIAMOND', 7],
  ['DIAMOND', 8],
  ['DIAMOND', 9],
  ['DIAMOND', 10],
  ['DIAMOND', 11],
  ['DIAMOND', 12],
  ['DIAMOND', 13],
  ['CLUB', 1],
  ['CLUB', 2],
  ['CLUB', 3],
  ['CLUB', 4],
  ['CLUB', 5],
  ['CLUB', 6],
  ['CLUB', 7],
  ['CLUB', 8],
  ['CLUB', 9],
  ['CLUB', 10],
  ['CLUB', 11],
  ['CLUB', 12],
  ['CLUB', 13],
  ['HEART', 1],
  ['HEART', 2],
  ['HEART', 3],
  ['HEART', 4],
  ['HEART', 5],
  ['HEART', 6],
  ['HEART', 7],
  ['HEART', 8],
  ['HEART', 9],
  ['HEART', 10],
  ['HEART', 11],
  ['HEART', 12],
  ['HEART', 13],
];

// POSITIONING OF THE CARDS ON THE TABLE
const cardsImgEl = [
  document.querySelector('.player-1'),
  document.querySelector('.dealer-1'),
  document.querySelector('.player-2'),
  document.querySelector('.dealer-2'),
  document.querySelector('.player-3'),
  document.querySelector('.player-4'),
  document.querySelector('.player-5'),
  document.querySelector('.player-6'),
  document.querySelector('.dealer-3'),
  document.querySelector('.dealer-4'),
  document.querySelector('.dealer-5'),
  document.querySelector('.dealer-6'),
];

// GENERAL DECLARATIONS
let state,
  scores,
  turn,
  cardNum,
  // playerScoreElPosition,
  // dealerScoreElPosition,
  playerAceCount,
  dealerAceCount,
  playerCash,
  dealerCash,
  betAmount,
  winner,
  downCard;

const currentHand = [];
const deck = [];

///////////////////////////////////  FUNCTIONS /////////////////////////////////

//RESET GAME
const resetGame = function () {
  state = 'betting';
  playerMoneyEl.textContent = '25,000';
  dealerMoneyEl.textContent = '100,000';
  playerCash = 25000;
  dealerCash = 100000;
  betAmount = 0;
};

// FUNCTION - RESET
const resetHand = function () {
  //Clear the deck for re-shuffling and shuffle
  for (let i = 0; i < deck.length; i++) deck[i] = [''];
  shuffle();

  state = 'playing';
  //Dealer = 0, Player = 1
  turn = 1;
  cardNum = 0;
  playerAceCount = 0;
  dealerAceCount = 0;

  //Reset the scores
  scores = [0, 0];
  dealerScoreText.textContent = 0;
  playerScoreText.textContent = 0;

  //hide messaages
  // messageBoxEl.classList.add('hidden');
  popUpEl.classList.add('hidden');

  //Revery the card elements back to showing the backs and hide
  for (const item of cardsImgEl) {
    item.src = 'img/cards/back.png';
    item.classList.add('hidden');
  }
};

//FUNCTION - SHUFFLING
const shuffle = function () {
  let cardNumber = 0;

  while (cardNumber < 52) {
    const num = Math.trunc(Math.random() * 52);
    if (!deck.includes(deckInOrder[num])) {
      deck[cardNumber] = deckInOrder[num];
      cardNumber++;
    }
  }
};

// Function - CHANGES FACE CARDS TO '10' and SHOWS THE CARD ON THE TABLE
const addCardToTotalAndShow = function ([suit, num], cardNum, turn) {
  // Shows card on table
  if (cardNum !== 1) {
    cardsImgEl[cardNum].src = `img/cards/${suit}-${num}.svg`;
    cardsImgEl[cardNum].classList.remove('hidden');
  } else {
    cardsImgEl[cardNum].classList.remove('hidden');
    downCard = `${suit}-${num}.svg`;
  }

  //Changes face-cards to 10
  if (num > 9) num = 10;
  //If ace, determins if 11 or 1
  if (num === 1 && scores[turn] < 11) {
    num = 11;
    turn === 0 ? dealerAceCount++ : playerAceCount++;
  }

  scores[turn] += num;
};

// FUNCTION - COMPARES THE SCORES AND ANNOUNCES THE WINNER
const compareScores = function () {
  dealerScoreText.textContent = scores[0];
  if (scores[0] > scores[1]) {
    popUpText.textContent = '😢 DEALER WINS!! ';
    winner = 'dealer';
  } else if (scores[0] < scores[1]) {
    popUpText.textContent = '😁 YOU WON!! ';
    winner = 'player';
  } else {
    popUpText.textContent = "😯 IT'S A PUSH!! ";
    winner = 'tie';
  }
  payWinner(winner);

  popUpEl.classList.remove('hidden');
  //Play again?
  pressDealToPlay();
};

// FUNCTION - CHECKS TO SEE WHO BUSTED AND ANNOUNCES THE WINNER
const checkForBust = function (player) {
  if (player === 'player') {
    popUpText.textContent = '🤯 BUST!! YOU LOSE!!';
    winner = 'dealer';
  } else {
    popUpText.textContent = '😁 DEALER BUSTS!! YOU WON!!';
    winner = 'player';
  }

  payWinner(winner);

  popUpEl.classList.remove('hidden');
  //Show place your bet in messageText box
  pressDealToPlay();
};

// FUNCTION - DISPLAYS A MESSAGE TO PRESS DEAL TO PLAY
const pressDealToPlay = function () {
  state = 'betting';
};

// Function - Pay the winner
const payWinner = function (winner) {
  if (winner === 'player') {
    playerCash += betAmount * 2;
    dealerCash -= betAmount;
  } else if (winner === 'dealer') {
    dealerCash += betAmount;
  } else {
    playerCash += betAmount;
  }

  playerMoneyEl.textContent = playerCash.toLocaleString('en-US');
  dealerMoneyEl.textContent = dealerCash.toLocaleString('en-US');
  betAmountText.textContent = 0;
  betAmount = 0;
};

const playerBlackjack = function () {
  cardsImgEl[1].classList.remove('hidden');

  popUpText.textContent = '😁 Blackjack!! YOU WON!! ';
  winner = 'player';

  playerCash += betAmount * 2.5;
  dealerCash -= betAmount * 1.5;
  playerMoneyEl.textContent = playerCash.toLocaleString('en-US');
  dealerMoneyEl.textContent = dealerCash.toLocaleString('en-US');
  betAmountText.textContent = 0;
  betAmount = 0;

  popUpEl.classList.remove('hidden');
  //Play again?
  pressDealToPlay();
};
const checkOverdraw = function (chip) {
  if (playerCash - chip < 0) {
    window.alert("You can't bet more than you have!!");
    return false;
  } else return true;
};

resetGame();
//////////////////////// EVENT LISTENERS ///////////////////////

//DEAL BUTTON
dealBtn.addEventListener('click', function () {
  if (betAmount > 0) {
    resetHand();
    //show dealers down card
    cardsImgEl[1].classList.remove('hidden');

    //deal 4 cards
    while (cardNum < 4) {
      addCardToTotalAndShow(deck[cardNum], cardNum, turn);

      cardNum++;
      turn = Math.abs(turn - 1);
    }

    //Show the score
    dealerScoreText.textContent = deck[3][1];
    playerScoreText.textContent = scores[1];

    //Checks for Blackjack

    if (scores[1] === 21) {
      playerBlackjack();
    } else if (scores[0] === 21) {
      compareScores();
      cardsImgEl[1].src = `img/cards/${deck[1][0]}-${deck[1][1]}.svg`;
      cardsImgEl[1].classList.remove('hidden');
    }
  } else window.alert('You have to place a bet!!');
});

hitBtn.addEventListener('click', function () {
  if (state === 'playing') {
    //Selects 'Player*
    turn = 1;
    //get card
    addCardToTotalAndShow(deck[cardNum], cardNum, turn);

    //change ace from 11 to 1 if over 21
    if (scores[1] > 21 && playerAceCount > 0) {
      scores[1] -= 10;
      playerAceCount--;
    }
    //Show score
    playerScoreText.textContent = scores[1];

    //adjust card total display position
    // playerScoreElPosition += 5.5;
    // playerScoreEl.style.left = `${playerScoreElPosition}rem`;

    //Check for bust
    if (scores[1] > 21) checkForBust('player');

    //go to next card
    cardNum++;
  }
});

standBtn.addEventListener('click', function () {
  if (state === 'playing') {
    // Set turn to dealer
    turn = 0;
    //Set place number to dealer's 3rd card
    let placeNum = 8;

    //Hide messageText box
    // messageBoxEl.classList.add('hidden');

    //Show dealer's 'down' card
    cardsImgEl[1].src = `img/cards/${deck[1][0]}-${deck[1][1]}.svg`;

    //Show score
    dealerScoreText.textContent = scores[0];

    //if dealer has more than 16, check for winner
    if (scores[0] >= 17) compareScores();

    //Get dealer's remaining cards
    while (state === 'playing') {
      //get next card
      addCardToTotalAndShow(deck[cardNum], placeNum, turn);

      //Add card to dealer's card total
      dealerScoreText.textContent = scores[0];

      //adjust card total display position
      // dealerScoreElPosition += 5.5;
      // dealerScoreEl.style.left = `${dealerScoreElPosition}rem`;

      //check for ace
      if (scores[0] > 21 && dealerAceCount > 0) {
        scores[0] -= 10;
        dealerAceCount--;
      }

      //Check for bust
      if (scores[0] > 21 && dealerAceCount === 0) {
        checkForBust('dealer');
      } else if (scores[0] >= 17) {
        compareScores(); //If dealer has more than 16, check for winner
      } else placeNum++; //Change place number
    }
  }
});

chip5.addEventListener('click', function () {
  if (state === 'betting' && checkOverdraw(5)) {
    playerCash -= 5;
    playerMoneyEl.textContent = playerCash.toLocaleString('en-US');
    betBox.classList.remove('hidden');

    betAmount += 5;
    betAmountText.textContent = betAmount.toLocaleString('en-US');
  }
});
chip25.addEventListener('click', function () {
  if (state === 'betting' && checkOverdraw(25)) {
    playerCash -= 25;
    playerMoneyEl.textContent = playerCash.toLocaleString('en-US');
    betBox.classList.remove('hidden');

    betAmount += 25;
    betAmountText.textContent = betAmount.toLocaleString('en-US');
  }
});
chip100.addEventListener('click', function () {
  if (state === 'betting' && checkOverdraw(100)) {
    playerCash -= 100;
    playerMoneyEl.textContent = playerCash.toLocaleString('en-US');
    betBox.classList.remove('hidden');

    betAmount += 100;
    betAmountText.textContent = betAmount.toLocaleString('en-US');
  }
});
chip500.addEventListener('click', function () {
  if (state === 'betting' && checkOverdraw(500)) {
    playerCash -= 500;
    playerMoneyEl.textContent = playerCash.toLocaleString('en-US');
    betBox.classList.remove('hidden');

    betAmount += 500;
    betAmountText.textContent = betAmount.toLocaleString('en-US');
  }
});
chip1000.addEventListener('click', function () {
  if (state === 'betting' && checkOverdraw(1000)) {
    playerCash -= 1000;
    playerMoneyEl.textContent = playerCash.toLocaleString('en-US');
    betBox.classList.remove('hidden');

    betAmount += 1000;
    betAmountText.textContent = betAmount.toLocaleString('en-US');
  }
});
