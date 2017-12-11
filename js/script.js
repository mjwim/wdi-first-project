$(() => {

  // Food creation function - create random food objects randomly at random heights and at random intervals between, say 1-3 seconds;
  //  object of food class {type: avocado, img: avocado, savings: -1000, health: +20}
  //  object of food class {type: potNoodle, img: potNoodle, savings: -100, health: +5}
  //  object of food class {type: bakedBeans, img: bakedBeans, savings: -100, health: +5}

  const foodArray = [{type: 'avocado' , img: 'avocado', savings: '-100' , health: '20' }, {type: 'bakedBeans' , img: 'bakedBeans', savings: '-10' , health: '5' }];

  console.log(foodArray);

  const $foodArea = $('.foodArea');

  function newFood() {
    setInterval(function () {
      const randomNumber = (Math.floor(Math.random()*(foodArray.length)));
      const newRandomFood = foodArray[randomNumber];
      const $newFood = $('<div>', {newRandomFood});
      console.log($newFood);
      $foodArea.append($newFood);
    }, 1000);
  }

  newFood();

  // food area functions

  const $food = $('.food');

  function moveFood() {

    const marginFood = ($food.css('marginLeft'));
    if (marginFood === '0px') {
      $food.css('display', 'none');
    }
    $food.animate({marginLeft: '-=10px'}, 50, 'swing', moveFood);
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
console.log($player);


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
