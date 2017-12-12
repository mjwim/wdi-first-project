$(() => {

  let gameOver = null;
  let $food = null; //this is needed as the moveFood function needs to check what the foodArea div contains (which is all the food elements) or something like that...

  const $instructions = $('.instructions');
  const $year = $('.year');
  const $housePrices = $('.housePrices');
  const $savings = $('.savings');
  const $health = $('.health');
  const $foodArea = $('.foodArea');
  const $house = $('.house');
  let savings = 1000;
  let housePrices = 100000;
  let health = 100;
  let year = 2017;


  function updateName() {
    let playerName = prompt('What is your name?');
    const $playerName = $('.playerName');
    if (!playerName) {
      playerName = 'Anonymous';
    }
    $playerName.text(playerName + ': ');
  }

  $('button').on('click', function() {
    gameOver = false;
    $instructions.addClass('hide');
    updateName();
    createNewFood();
    yearCounter();
    housePriceRises();
    savingsRises();
    healthFalls();
  });

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
    const timer = setInterval(function () {
      const avocado = new Food('Avocado', Math.random()*300, -1500, 25);
      const bakedBeans = new Food('Baked Beans', Math.random()*300, -100, 5);
      const foodOptionsArray = [avocado, bakedBeans];
      const randomNumber = (Math.floor(Math.random()*(foodOptionsArray.length)));
      const newRandomFood = foodOptionsArray[randomNumber];
      clear(timer);
      appendNewFood(newRandomFood);
    }, 1500);
  }

  function appendNewFood(newRandomFood) {
    const newFood = $('<div/>', {class: newRandomFood.class, css: {top: newRandomFood.css.top}, 'data-savings': newRandomFood.savings, 'data-health': newRandomFood.health });
    $foodArea.append(newFood);
    moveFood();
  }

  // food area functions
  function moveFood() {
    $food = $('.food');
    const leftFood = ($food.css('left'));
    if (leftFood <= '0px') {
      collisionDetection();
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
    if (savings >= 0.1*housePrices) {
      $house.css('font-size', '650%');
    } else if (savings >= 0.75*0.1*housePrices) {
      $house.css('font-size', '500%');
    } else if (savings >= 0.5*0.1*housePrices) {
      $house.css('font-size', '300%');
    } else if (savings === 0.25*0.1*housePrices) {
      $house.css('font-size', '150%');
    }
  }

  // scoreboard functions

  function housePriceRises() {
    const timer = setInterval(function () {
      housePrices += 200;
      $housePrices.text(housePrices);
      clear(timer);
    }, 100);
  }

  function savingsRises() {
    const timer = setInterval(function () {
      savings += 100;
      $savings.text(savings);
      houseChanging(savings);
      winSavings(savings);
      clear(timer);
    }, 100);
  }

  function healthFalls() {
    const timer = setInterval(function () {
      let healthNew = health;
      healthNew--;
      $health.text(healthNew);
      loseHealth(healthNew);
      health = healthNew;
      clear(timer);
    }, 1000);
  }

  function impactOnHealthAndSavings(h, s) {
    savings += s;
    $savings.text(savings);
    let healthNew = health;
    healthNew += h;
    let healthMax = null;
    if (healthNew < 100) {
      healthMax = healthNew;
    } else {
      healthMax = 100;
    }
    health = healthMax;
    $health.text(healthMax);
  }

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

  function yearCounter() {
    const timer = setInterval(function () {
      year += 1;
      $year.text(year);
      clear(timer);
    }, 1000);
  }

  function loseHealth(health) {
    if (health <= 0) {
      gameOver = true;
      console.log('you lose');
      reset();
    }
  }

  function winSavings(savings) {
    const $year = $('.year');
    const year = $year.text();
    if (savings >= 0.1*housePrices) {
      gameOver = true;
      updateHighScores(year);
      console.log(`You win, score = ${year}`);
      reset();
    }
  }

  function updateHighScores(year) {
    const $highScore = $('.highScore');
    $highScore.text(year);
  }

  function clear(timer) {
    if (gameOver) {
      clearInterval(timer);
    }
  }

  function reset() {
    $foodArea.empty();
    housePrices = 100000;
    $housePrices.text(housePrices);
    savings = 1000;
    $savings.text(savings);
    health = 100;
    $health.text(health);
    year = 2017;
    $year.text(health);
    $instructions.removeClass('hide');
  }

});
