const handArea = document.querySelector(".hand");
const buttons = handArea.querySelectorAll("button");

const doraIndicator = document.querySelector("#dora-indicator");
const wallIndicator = document.querySelector("#counter");

const uradoraIndicator = document.querySelector("#uradora-indicator");
const uradoraShowButton = document.querySelector("#uradora-show");

const playerDiscardDisplay = document.querySelector("#player");
const shimochaDiscardDisplay = document.querySelector("#shimocha");
const toimenDiscardDisplay = document.querySelector("#toimen");
const kamichaDiscardDisplay = document.querySelector("#kamicha");

const oyaIndicators = document.querySelectorAll("#oya");
const oyaIcon = "-東- ";

let wall = [];

let remainingTiles;
let noTilesLeft = false;

class Mentsu {
  constructor(discardDisplay) {
    this.hand = [];
    this.discard = [];
    this.discardDisplay = discardDisplay;
  }

  makeInitialHand() {
    this.hand = wall.splice(0, 13);
  }

  drawTile(isBot = false) {
    let randomTile = wall.splice(0, 1)[0];
    this.hand.push(randomTile);
    if (!isBot) {
      this.updateHand();
      updateIndicator();
      return;
    }
    // ツモ切り
    this.discard.push(randomTile);
    this.hand.splice(13, 1);
    this.updateDiscard(randomTile);
    updateIndicator();
  }

  discardTile(index) {
    if (noTilesLeft) return;
    let discardedTile = this.hand[index];
    this.discard.push(discardedTile);
    this.updateDiscard(discardedTile);
    this.hand.splice(index, 1);
    this.sortHand();
    this.updateHand();
    // Simulate Other Players
    this.tsumogiriBot(shimocha);
    this.tsumogiriBot(toimen);
    this.tsumogiriBot(kamicha);
    if (wall.length === 0) {
      noTilesLeft = true;
      return;
    }
    this.drawTile();
  }

  tsumogiriBot(mentsu) {
    if (wall.length === 0) return;
    mentsu.drawTile(true);
  }

  updateDiscard(discardedTile) {
    this.discardDisplay.append(
      ` [${discardedTile.number + discardedTile.suit}]`
    );
  }

  updateHand() {
    if (this.hand.length === 13) buttons[13].innerHTML = "";
    this.hand.forEach((tile, index) => {
      buttons[index].innerHTML = tile.number + tile.suit;
    });
  }

  sortHand() {
    this.hand.sort((a, b) => {
      if (a.suit < b.suit) {
        return -1;
      }
      if (a.suit > b.suit) {
        return 1;
      }
      if (a.suit === b.suit) {
        if (a.number < b.number) {
          return -1;
        }
        if (a.number > b.number) {
          return 1;
        }
        return 0;
      }
    });
  }
}

const player = new Mentsu(playerDiscardDisplay);
const shimocha = new Mentsu(shimochaDiscardDisplay);
const toimen = new Mentsu(toimenDiscardDisplay);
const kamicha = new Mentsu(kamichaDiscardDisplay);

const mentsuAll = [player, shimocha, toimen, kamicha];

const makeWall = () => {
  for (let _ = 0; _ < 4; _++) {
    for (let i = 1; i < 10; i++) {
      wall.push(makeTile("p", i));
      wall.push(makeTile("m", i));
      wall.push(makeTile("s", i));
    }
    wall.push(makeTile("中"));
    wall.push(makeTile("白"));
    wall.push(makeTile("發"));
    wall.push(makeTile("東"));
    wall.push(makeTile("西"));
    wall.push(makeTile("南"));
    wall.push(makeTile("北"));
  }
};

const makeTile = (suit, i = "") => {
  return {
    number: i,
    suit: suit,
  };
};

const makeDeadWall = () => {
  wanpai = wall.splice(0, 12);
  dora = wall.splice(0, 1)[0];
  uradora = wall.splice(0, 1)[0];
  doraIndicator.innerHTML = dora.number + dora.suit;
  uradoraIndicator.innerHTML = `裏ドラ [${uradora.number + uradora.suit}]`;
};

const defineOya = () => {
  const oya = Math.floor(Math.random() * 4);
  switch (oya) {
    case 0:
      player.drawTile();
      oyaIndicators[0].innerHTML = oyaIcon;
      break;
    case 1:
      oyaIndicators[1].innerHTML = oyaIcon;
      shimocha.drawTile(true);
      toimen.drawTile(true);
      kamicha.drawTile(true);
      player.drawTile();
      break;
    case 2:
      oyaIndicators[2].innerHTML = oyaIcon;
      toimen.drawTile(true);
      kamicha.drawTile(true);
      player.drawTile();
      break;
    case 3:
      oyaIndicators[3].innerHTML = oyaIcon;
      kamicha.drawTile(true);
      player.drawTile();
      break;
  }
};

const updateIndicator = () => {
  wallIndicator.innerHTML = wall.length;
};

function gameStart() {
  makeWall();
  wall = wall.sort((a, b) => 0.5 - Math.random());
  makeDeadWall();
  mentsuAll.forEach((player) => player.makeInitialHand());
  player.sortHand();
  defineOya();
}

gameStart();

player.hand.forEach((_, index) => {
  buttons[index].addEventListener(
    "click",
    player.discardTile.bind(player, index)
  );
});

const showUradora = () => {
  uradoraShowButton.classList.add("hidden");
  uradoraShowButton.removeEventListener("click", showUradora);
  uradoraIndicator.classList.replace("hidden", "visible");
};

uradoraShowButton.addEventListener("click", showUradora);

function debugFunc() {
  console.log("p_discard", player.discard);
  console.log("p_hand", player.hand);
  console.log("s_discard", shimocha.discard);
  console.log("s_hand", shimocha.hand);
  console.log("t_discard", toimen.discard);
  console.log("t_hand", toimen.hand);
  console.log("k_discard", kamicha.discard);
  console.log("k_hand", kamicha.hand);
}
