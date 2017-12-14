$(() => {

  //global variables

  //level variables

  const easy = {housePriceRiseRate: '200', foodCreationRate: '1500', foodMoveSpeed: '20'};
  const medium = {housePriceRiseRate: '400', foodCreationRate: '1000', foodMoveSpeed: '10'};
  const hard = {housePriceRiseRate: '600', foodCreationRate: '500', foodMoveSpeed: '5'};
  const reality = {housePriceRiseRate: '10000', foodCreationRate: '500', foodMoveSpeed: '5'};
  let level = easy;

  // DOM variables

  const $instructions = $('.instructions');
  const $year = $('.year');
  const $housePrices = $('.housePrices');
  const $savings = $('.savings');
  const $health = $('.health');
  const $foodArea = $('.foodArea');
  const $house = $('.house');
  let $food = null;

  // player movement variables

  let playerTopDisplacement = 0;

  // game stats variables

  let savings = 1000;
  let housePrices = 100000;
  let health = 100;
  let year = 2017;

  // game status variable

  let gameOver = true;

  // setup functions

  function updateName() {
    const $playerName = $('.playerName');
    let playerNameInput = document.getElementById('playerNameInput').value;
    if (!playerNameInput) {
      playerNameInput = 'Anonymous';
    }
    $playerName.text(playerNameInput);
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
    musicOn();
    detectswipe('player', mobileMoveSwipe);
  }

  // music function

  function musicOn(){
    const $music =$('#music')[0];
    $music.src = './audio/daFunkLoop.mp3';
    $music.play();
  }

  function gameOverSound(){
    const $gameOverSound =$('#gameOverSound')[0];
    $gameOverSound.src = './audio/gameOver.mp3';
    $gameOverSound.play();
  }

  function gameWinSound(){
    const $gameWinSound =$('#gameWinSound')[0];
    $gameWinSound.src = './audio/win.mp3';
    $gameWinSound.play();
  }

  function musicOff(){
    const $music =$('#music')[0];
    $music.pause();
  }

  // food setup functions

  function Food(type, top, left, savings, health) {
    if(!(this instanceof Food)) {
      return new Food(type, top, left, savings, health);
    }
    this.type = type;
    this.css = {top: top, left: left};
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
      const $left = $('.foodArea');
      const foodStartingPosition = parseInt($left.css('width'));
      const avocado = new Food('Avocado', Math.random()*400, foodStartingPosition-100,  -1000, 3);
      const bakedBeans = new Food('Baked Beans', Math.random()*400, foodStartingPosition-100, -100, 1);
      const foodOptionsArray = [avocado, bakedBeans];
      const randomNumber = (Math.floor(Math.random()*(foodOptionsArray.length)));
      const newRandomFood = foodOptionsArray[randomNumber];
      clear(timer);
      appendNewFood(newRandomFood);
    }, parseInt(level.foodCreationRate));
  }

  function appendNewFood(newRandomFood) {
    const newFood = $('<div/>', {class: newRandomFood.class, css: {top: newRandomFood.css.top, left: newRandomFood.css.left}, 'data-savings': newRandomFood.savings, 'data-health': newRandomFood.health });
    $foodArea.append(newFood);
    moveFood();
  }

  // food area function

  function moveFood() {
    $food = $('.food');
    const leftFood = ($food.css('left'));
    if (leftFood <= '0px') {
      collisionDetection();
    }
    $food.animate({left: '-=10px'}, parseInt(level.foodMoveSpeed), 'swing', moveFood);
  }

  function removeFood() {
    const $foodArea = $('.foodArea');
    $foodArea.find('div').first().remove();
  }

  // player area functions

  $(document).keydown(function(e) {
    const $player = $('.player');
    const playerTop = $player.css('top');
    if (e.which === 38 && parseFloat(playerTop) >= 50) { //up arrow key
      e.preventDefault();
      playerTopDisplacement -= 50;
      $player.css('top', `${playerTopDisplacement}px`);
    } else if (e.which === 40 && parseFloat(playerTop) <= 350) { //bottom arrow key
      e.preventDefault();
      playerTopDisplacement += 50;
      $player.css('top', `${playerTopDisplacement}px`);
    }
  });

  // mobile move by swiping up or down function

  function mobileMoveSwipe(el,direc){
    const $player = $('.player');
    const playerTop = $player.css('top');
    if (direc === 'u' && parseFloat(playerTop) >= 50) { //up swipe
      playerTopDisplacement -= 50;
      $player.css('top', `${playerTopDisplacement}px`);
    } else if (direc === 'd' && parseFloat(playerTop) <= 350) { //down swipe
      playerTopDisplacement += 50;
      $player.css('top', `${playerTopDisplacement}px`);
    }
  }
  function detectswipe(el,func) {
    const swipeDet = new Object();
    swipeDet.sX = 0;
    swipeDet.sY = 0;
    swipeDet.eX = 0;
    swipeDet.eY = 0;
    const minX = 20;  //min x swipe for horizontal swipe
    const maxX = 40;  //max x difference for vertical swipe
    const minY = 40;  //min y swipe for vertical swipe
    const maxY = 50;  //max y difference for horizontal swipe
    let direc = '';
    const ele = document.getElementsByClassName(el);
    ele.addEventListener('touchstart',function(e){
      const t = e.touches[0];
      swipeDet.sX = t.screenX;
      swipeDet.sY = t.screenY;
    },false);
    ele.addEventListener('touchmove',function(e){
      e.preventDefault();
      const t = e.touches[0];
      swipeDet.eX = t.screenX;
      swipeDet.eY = t.screenY;
    },false);
    ele.addEventListener('touchend',function(e){
      e.preventDefault();
      //horizontal detection
      if ((((swipeDet.eX - minX > swipeDet.sX) || (swipeDet.eX + minX < swipeDet.sX)) && ((swipeDet.eY < swipeDet.sY + maxY) && (swipeDet.sY > swipeDet.eY - maxY)))) {
        if(swipeDet.eX > swipeDet.sX) direc = 'r';
        else direc = 'l';
      }
      //vertical detection
      if ((((swipeDet.eY - minY > swipeDet.sY) || (swipeDet.eY + minY < swipeDet.sY)) && ((swipeDet.eX < swipeDet.sX + maxX) && (swipeDet.sX > swipeDet.eX - maxX)))) {
        if(swipeDet.eY > swipeDet.sY) direc = 'd';
        else direc = 'u';
      }

      if (direc !== '') {
        if(typeof func === 'function') func(el,direc);
      }
      direc = '';
    },false);
  }

  //face changing functions

  function facesEating() {
    const $faces = $('.faces');
    $faces.text('😋');
    munchingSound();
    setTimeout(facesReturning, 200);
  }

  function facesReturning() {
    const $faces = $('.faces');
    $faces.text('😀');
  }

  function munchingSound(){
    const $audio =$('#audio')[0];
    $audio.src = './audio/bite-hq.wav';
    $audio.play();
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

  // house changing function

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

  function yearCounter() {
    const timer = setInterval(function () {
      year += 1;
      $year.text(year);
      clear(timer);
    }, 1000);
  }

  // Game Over functions

  function loseHealth(health) {
    if (health <= 0 || year === 2100) {
      gameOver = true;
      $foodArea.empty();
      musicOff();
      gameOverSound();
      $('.youLose').css('display', 'inline');
    }
  }

  function winSavings(savings) {
    const $year = $('.year');
    const year = $year.text();
    if (savings >= 0.1*housePrices) {
      gameOver = true;
      $foodArea.empty();
      musicOff();
      gameWinSound();
      updateHighScores(year);
      $('.youWin').css('display', 'inline');
    }
  }

  function updateHighScores(year) {
    const $bestScore = $('.bestScore');
    const $bestPlayer = $('.playerName');
    const bestPlayer = $bestPlayer.text() + ': ';
    const score = parseInt(year);
    const bestScore = localStorage.getItem('bestscore');
    if(bestScore !== null){
      if (score < bestScore) {
        localStorage.setItem('bestScore', score);
        localStorage.setItem('bestPlayer', bestPlayer);
      }
    } else {
      localStorage.setItem('bestScore', score);
      localStorage.setItem('bestPlayer', bestPlayer);
    }
    $bestScore.text(year);
    const $leaderboardBestPlayer = $('.bestPlayer');
    $leaderboardBestPlayer.text(bestPlayer);
  }

  // stop running functions function
  function clear(timer) {
    if (gameOver) {
      clearInterval(timer);
    }
  }

  // reset functions

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
