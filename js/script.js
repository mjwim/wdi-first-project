$(() => {

  // Food creation function - create random food objects randomly at random heights and at random intervals between, say 1-3 seconds;
  //  object of food class {type: avocado, img: avocado, savings: -1000, health: +20}
  //  object of food class {type: bakedBeans, img: bakedBeans, savings: -100, health: +5}

  function Food(type, top, left, img, savings, health) {
    if(!(this instanceof Food)) {
      return new Food(type, top, left, img, savings, health);
    }
    this.type = type;
    this.css = {top: top, left: left, background: img};
    this.savings = savings;
    this.health = health;
    if(this.type === 'Avocado'){
      this.class = 'food avocado';
    } else if(this.type === 'Baked Beans'){
      this.class = 'food bakedBeans';
    }
  }

  function createNewFood() {
    setInterval(function () {
      const avocado = new Food('Avocado', Math.random()*300, 400, 'Avocado', -1000, 100);
      const bakedBeans = new Food('Baked Beans', Math.random()*300, 400, 'Baked Beans', -100, 5);
      const foodOptionsArray = [avocado, bakedBeans];
      const randomNumber = (Math.floor(Math.random()*(foodOptionsArray.length)));
      const newRandomFood = foodOptionsArray[randomNumber];
      appendNewFood(newRandomFood);
    }, 1000);
  }


  const $foodArea = $('.foodArea');

  function appendNewFood(newRandomFood) {
    const appendedFood = newRandomFood;
    console.log(appendedFood);
    const top = newRandomFood.css.top;
    console.log(top);
    const $newFood = $('<div/>', {class: newRandomFood.class, css: {top: top, left: newRandomFood.css.left, background: newRandomFood.css.img}, savings: newRandomFood.savings, health: newRandomFood.health });
    //const $newFood = $('<div/>', {class: 'food bakedBeans', css: {top: '200px', left: '600px'}});
    $foodArea.append($newFood);
  }

  createNewFood();
  appendNewFood();

  // food area functions

  function moveFood() {
    const $food = $('.food');
    const leftFood = ($food.css('left'));
    if (leftFood === '0px') {
      $food.css('display', 'none');
    }
    $food.animate({left: '-=10px'}, 50, 'swing', moveFood);
  }

  moveFood();

  // scoreboard functions

  let housePrices = 100000;

  function housePriceRises() {
    const $housePrices = $('.housePrices');
    setInterval(function () {
      housePrices += 1000;
      $housePrices.text(housePrices);
    }, 1000);
  }

  let savings = 0;

  function savingsRises() {
    const $savings = $('.savings');
    setInterval(function () {
      savings += 500;
      $savings.text(savings);
    }, 1000);
  }

  let health = 100;

  function healthFalls() {
    const $health = $('.health');
    setInterval(function () {
      health -= 1;
      $health.text(health);
    }, 1000);
  }

  housePriceRises();
  savingsRises();
  healthFalls();


});

//collision dection function

const $player = $('.player');
const $food = $('.food');


function collisionDetection(player , food) {
  if (player.x < food.x + food.width &&
     player.x + player.width > food.x &&
     player.y < food.y + food.height &&
     player.height + player.y > food.y) {
    console.log('collision detected!');
  }
  // on collision need to send variables to savings and health functions depending
  // on food type. Avocado will send bigger -ve to savings but bigger +ve to health
}

collisionDetection($player , $food);


// player area functions
// player move up and down with UP and DOWN eys

// scrolling time bar function - years pass across the top from right to left

// player image functions - as every 15ish years pass, your image changes to an older one.

// house building functions - every increase of 2% towards 10% savings/ house prie ratio
// 2% adds a square, 4% adds door, 6% bottom windows, 8% top windows, 10% roof

// win/lose functions - if savings = 10% of house prices you win. If health goes to zero you lose (which automatically happens in 2100) - Your score is the year in which you get to 10%.
