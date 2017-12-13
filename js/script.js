$(() => {

  const easy = {housePriceRiseRate: '200', foodCreationRate: '1500', foodMoveSpeed: '20'};
  const medium = {housePriceRiseRate: '400', foodCreationRate: '1000', foodMoveSpeed: '10'};
  const hard = {housePriceRiseRate: '600', foodCreationRate: '500', foodMoveSpeed: '5'};
  const reality = {housePriceRiseRate: '10000', foodCreationRate: '500', foodMoveSpeed: '5'};
  let level = easy; //needs to change based on easy/medium/reality button clicked
  const $instructions = $('.instructions');
  const $year = $('.year');
  const $housePrices = $('.housePrices');
  const $savings = $('.savings');
  const $health = $('.health');
  const $foodArea = $('.foodArea');
  const $house = $('.house');
  // const housePriceRiseRate = parseInt(level.housePriceRiseRate);
  // const foodCreationRate = parseInt(level.foodCreationRate);
  // const foodMoveSpeed = parseInt(level.foodMoveSpeed);
  let playerTopDisplacement = 0;
  let savings = 1000;
  let housePrices = 100000;
  let health = 100;
  let year = 2017;
  let gameOver = true;
  let $food = null; //this is needed as the moveFood function needs to check what the foodArea div contains (which is all the food elements) or something like that...

  function updateName() {
    const $playerName = $('.playerName');
    let playerNameInput = document.getElementById('playerNameInput').value;
    if (!playerNameInput) {
      playerNameInput = 'Anonymous';
    }
    $playerName.text(playerNameInput + ': ');
  }

  $('.startButton').on('click', function() {
    const levelSelected = $(this).text();
    levelSelector(levelSelected);
  });

  function levelSelector(levelSelected) {
    const chosenLevel = levelSelected;
    if (chosenLevel === 'Easy') {
      level = easy;
    } else if (chosenLevel === 'Medium') {
      level = medium;
    } else if (chosenLevel === 'Hard') {
      level = hard;
    } else if (chosenLevel === 'Reality') {
      level = reality;
    }
    gameOver = false;
    $instructions.addClass('hide');
    updateName();
    createNewFood();
    yearCounter();
    housePriceRises();
    savingsRises();
    healthFalls();
  }

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
      const avocado = new Food('Avocado', Math.random()*300, -1000, 3);
      const bakedBeans = new Food('Baked Beans', Math.random()*300, -100, 1);
      const foodOptionsArray = [avocado, bakedBeans];
      const randomNumber = (Math.floor(Math.random()*(foodOptionsArray.length)));
      const newRandomFood = foodOptionsArray[randomNumber];
      clear(timer);
      appendNewFood(newRandomFood);
    }, parseInt(level.foodCreationRate));
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
    $food.animate({left: '-=10px'}, parseInt(level.foodMoveSpeed), 'swing', moveFood);
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
      housePrices += parseInt(level.housePriceRiseRate);
      $housePrices.text(housePrices);
      clear(timer);
    }, 100);
  }

  function savingsRises() {
    const timer = setInterval(function () {
      savings += 1000;
      $savings.text(savings);
      houseChanging(savings);
      winSavings(savings);
      clear(timer);
    }, 1000);
  }

  function healthFalls() {
    const timer = setInterval(function () {
      let healthNew = health;
      healthNew--;
      $health.text(healthNew);
      loseHealth(healthNew);
      health = healthNew;
      clear(timer);
    }, 250);
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

  // player move up and down with UP and DOWN keys

  $(document).keydown(function(e) {
    const $player = $('.player');
    const playerTop = $player.css('top');
    if (e.which === 38 && parseFloat(playerTop) >= 50) { //up arrow key
      playerTopDisplacement -= 50;
      $player.css('top', `${playerTopDisplacement}px`);
    } else if (e.which === 40 && parseFloat(playerTop) <= 350) { //bottom arrow key
      playerTopDisplacement += 50;
      $player.css('top', `${playerTopDisplacement}px`);
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
    if (health <= 0 || year === 2100) {
      gameOver = true;
      $foodArea.empty();
      $('.youLose').css('display', 'inline');
    }
  }

  function winSavings(savings) {
    const $year = $('.year');
    const year = $year.text();
    if (savings >= 0.1*housePrices) {
      gameOver = true;
      $foodArea.empty();
      updateHighScores(year);
      $('.youWin').css('display', 'inline');
      console.log(`You win, score = ${year}`);
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

  $('.playAgainButton').on('click', function() {
    $('.youWin').css('display', 'none');
    $('.youLose').css('display', 'none');
    reset();
  });

  function reset() {
    housePrices = 100000;
    $housePrices.text(housePrices);
    savings = 1000;
    $savings.text(savings);
    health = 100;
    $health.text(health);
    year = 2017;
    $year.text(health);
    $instructions.removeClass('hide');
    $house.css('font-size', '100%');
  }

});
