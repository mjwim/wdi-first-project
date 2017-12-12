$(() => {

  // Food creation function - Creating random food objects at random heights (option to add random interval?);
  const $foodArea = $('.foodArea');

  function Food(type, top, savings, health) {
    if(!(this instanceof Food)) {
      return new Food(type, top, savings, health);
    }
    this.type = type;
    this.css = {top: top};
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
      const avocado = new Food('Avocado', Math.random()*300, -1500, 25);
      const bakedBeans = new Food('Baked Beans', Math.random()*300, -100, 5);
      const foodOptionsArray = [avocado, bakedBeans];
      const randomNumber = (Math.floor(Math.random()*(foodOptionsArray.length)));
      const newRandomFood = foodOptionsArray[randomNumber];
      appendNewFood(newRandomFood);
    }, 1500);
  }

  function appendNewFood(newRandomFood) {
    const $newFood = $('<div/>', {class: newRandomFood.class, css: {top: newRandomFood.css.top}, 'data-savings': newRandomFood.savings, 'data-health': newRandomFood.health });
    $foodArea.append($newFood);
    moveFood();
  }

  createNewFood();

  // food area functions
  let $food = null;

  function moveFood() {
    $food = $('.food');
    const leftFood = ($food.css('left'));
    if (leftFood <= '0px') {
      collisionDetection(); //what should these arguments be
    }
    $food.animate({left: '-=10px'}, 50, 'swing', moveFood);
  }

  //collision detection function

  function collisionDetection() {
    $food = $('.food');
    const $player = $('.player');
    const $foodOffset = $food.offset();
    const $playerOffset = $player.offset();

    if ($foodOffset.left <= $playerOffset.left + $player.width() &&
       $foodOffset.left + $food.width() >= $playerOffset.left &&
       $foodOffset.top < $playerOffset.top + $player.height() &&
       $food.height() + $foodOffset.top > $playerOffset.top) {
      impactOnHealthAndSavings($food.data('health'), $food.data('savings'));
      facesEating();
    }
    removeFood();
    console.log('removefood');
  }

  function removeFood() {
    const $foodArea = $('.foodArea');
    $foodArea.find('div').first().remove();
  }

  //face changing functions

  function facesEating() {
    const $faces = $('.faces');
    $faces.text('😋');
    setTimeout(facesReturning, 200);
  }

  function facesReturning() {
    const $faces = $('.faces');
    $faces.text('😀');
  }

  // house changing functions

  function houseChanging(savings) {
    const $house = $('.house');
    const $housePrices = $('.housePrices');
    const housePrices = (parseInt($housePrices.text()));
    if (savings >= 0.1*housePrices) {
      $house.css('font-size', '650%');
      console.log('1');
    } else if (savings >= 0.75*0.1*housePrices) {
      $house.css('font-size', '500%');
      console.log('2');
    } else if (savings >= 0.5*0.1*housePrices) {
      $house.css('font-size', '300%');
      console.log('3');
    } else if (savings === 0.25*0.1*housePrices) {
      $house.css('font-size', '150%');
      console.log('4');
    }
  }



  // scoreboard functions

  let housePrices = 100000;

  function housePriceRises() {
    const $housePrices = $('.housePrices');
    setInterval(function () {
      housePrices += 2000;
      $housePrices.text(housePrices);
    }, 1000);
  }

  function impactOnHealthAndSavings(h, s) {
    const $savings = $('.savings');
    let savings = parseInt($savings.text());
    savings += s;
    $savings.text(savings);
    const $health = $('.health');
    let health = parseInt($health.text());
    health += h;
    $health.text(health);
  }

  function savingsRises() {
    const $savings = $('.savings');
    let savings = parseInt($savings.text());
    setInterval(function () {
      savings += 20;
      $savings.text(savings);
      houseChanging(savings);
      winSavings(savings);

    }, 20);
  }

  function healthFalls() {
    const $health = $('.health');
    let health = parseInt($health.text());
    setInterval(function () {
      health -= 1;
      $health.text(health);
      loseHealth(health);
    }, 1000);
  }

  housePriceRises();
  savingsRises();
  healthFalls();


});


// player area functions

// player move up and down with UP and DOWN keys - Need to stop it from exiting area

$(document).keydown(function(e) {
  switch (e.which) {
    case 38:
      $('.player').stop().animate({
        top: '-=50'
      }); //up arrow key
      break;
    case 40:
      $('.player').stop().animate({
        top: '+=50'
      }); //bottom arrow key
      break;
  }
});



// scrolling time bar function - years pass across the top from right to left

// player image functions - as every 15ish years pass, your image changes to an older one.

// house building functions - every increase of 2% towards 10% savings/ house prie ratio
// 2% adds a square, 4% adds door, 6% bottom windows, 8% top windows, 10% roof

// win/lose functions - if savings = 10% of house prices you win. If health goes to zero you lose (which automatically happens in 2100) - Your score is the year in which you get to 10%.

function loseHealth(health) {
  if (health <= 0) {
    alert('you lose');
  }
}

function winSavings(savings) {
  const $housePrices = $('.housePrices');
  const housePrices = (parseInt($housePrices.text()));
  if (savings >= 0.1*housePrices) {
    console.log('you win');
  }
}
