/***********************************************************************************
  SaveSweetfieldCity
  by Katrina Monje

  This project uses the p5.2DAdventure.js, p5.clickable.js, and p5.play.js classes.

  This is an Interaction Design Course project about environmental injustices, specifically how underserved communities in 'Sacrifice Zones' are being affected negatively. 
  This project aims to explore clickables and  and navigating between screens using an avatar.
  The story follows a young Felicity Walker who needs to save her hometown, Sweetfield City, whose sweetfield crops are taken away by the neighboring town Goldfolk.
  Instructions
  (1) Navigate between states through the keyboard. Press the SPACEBAR to advance to the next screen (state).
  (2) Click on buttons as you follow along the instructions that pop out when the avatar hovers.
  (3) Press the arrow keys in screens to go to other levels.
  Also start your localhost before running this, otherwise no PNGs will display.

  Further info is included in the README file.
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play player sprite
var playerSprite;
var playerAnimation;

// narrative and instructions text
var narrativeText;
var narrativeVisible = false;
var dialogueBoxX = 640 - 480; // width of screen / 2 - width of dialogue box /2 
var dialogueBoxY = 360 - 130; // height of screen / 2 - height of screen / 2
var currentLevel = " ";
var currentNarrative = " "; 

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// indexes into the clickable array (constants)
const playGameIndex = 0;

// Allocate Adventure Manager with states table and interaction tables
function preload() {

  //debug screen
  debugScreen = new DebugScreen();
  debugScreen.print("loading table");

  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  // Fonts and images for narrative text 
  fontcurrentLevel = loadFont('fonts/AtariClassic-Regular.ttf');
  fontNarrativeText = loadFont('fonts/Katrinus.ttf');
  dialogueBox = loadImage('assets/dialogueBox.png');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // create a sprite and add the 3 animations
  playerSprite = createSprite(width/2, height/2, 80, 80);

  // every animation needs a descriptor, since we aren't switching animations, this string value doesn't matter
  playerSprite.addAnimation('idle', loadAnimation('assets/avatars/felicityWalker.png'));
  playerSprite.addAnimation('walk', loadAnimation('assets/avatars/felicityWalker-01.png', 'assets/avatars/felicityWalker-04.png'));  

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen, Instructions screen, and other narrative screens
  if( adventureManager.getStateName() !== "splashScreen" && 
      adventureManager.getStateName() !== "sacrificeZoneIntroScreen" && 
      adventureManager.getStateName() !== "narrativeIntroOneScreen" && 
      adventureManager.getStateName() !== "sweetfieldMapOneScreen" && 
      adventureManager.getStateName() !== "narrativeIntroTwoScreen" && 
      adventureManager.getStateName() !== "sweetfieldMapTwoScreen" && 
      adventureManager.getStateName() !== "instructionsScreen" &&
      adventureManager.getStateName() !== "sweetfieldSavedBScreen" &&
      adventureManager.getStateName() !== "narrativeEndingScreen" && 
      adventureManager.getStateName() !== "climateJusticeAllianceScreen") {
      
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  }

  // draw instructions for levels
  drawNarrativeBox(); 
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  if(keyIsDown(RIGHT_ARROW)) {
    playerSprite.changeAnimation('walk');
    playerSprite.mirrorX(1);
    playerSprite.velocity.x = 6;
  }
  else if(keyIsDown(LEFT_ARROW)) {
    playerSprite.changeAnimation('walk');
    playerSprite.mirrorX(-1);
    playerSprite.velocity.x = -6;
  }
  else if(keyIsDown(DOWN_ARROW)) {
    playerSprite.changeAnimation('walk');
    playerSprite.velocity.y = 6;
  }
  else if(keyIsDown(UP_ARROW)) {
    playerSprite.changeAnimation('walk');
    playerSprite.velocity.y = -6;
  }
  else {
    playerSprite.changeAnimation('idle');
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
  }
}

//--------------  FOR INSTRUCTIONS TEXT  --------//

function drawNarrativeBox() {
  if( narrativeVisible === true) {
    image(dialogueBox, dialogueBoxX, dialogueBoxY);
    drawNarrativeText();
  }
}

function drawNarrativeText() {
  // current level
  push();
  textSize(25);
  textFont(fontcurrentLevel);
  fill("#694205");
  text(currentLevel, dialogueBoxX + 150, dialogueBoxY + 100);
  pop();

  // narrative instructions 
  push();
  textSize(23);
  textFont(fontNarrativeText);
  fill("#000000");
  text(currentNarrative, dialogueBoxX + 150, dialogueBoxY + 140);
  pop();
}


//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}



//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

// Sacrifice Zone Intro
class sacrificeZoneIntroRoom extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4;
    this.textBoxX = 200;
    this.textBoxY = 250;

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "This game is intends to raise awareness of environmental racism through the existence of “Sacrifice Zones”, and how frontline communities face compounding crises. A sacrifice zone is “an area targeted for the disproportionate burden of pollution, and for the by-products of consumerism and of industrial disregard.\n\n\n[press SPACE to continue]";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill('#694205');
    textAlign(CENTER);
    textSize(30);
    textFont(fontNarrativeText);

    // Draw text in a box
    text(this.instructionsText, this.textBoxX, this.textBoxY, this.textBoxWidth, this.textBoxHeight );
  }
}

// Narrative Intro One
class narrativeIntroOneRoom extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4;
    this.textBoxX = 200;
    this.textBoxY = 250;

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "Not too long ago, Sweetfield City was nothing but a peaceful world filled with crops and prosperity. Everyone got along well, and the town relied heavily on trade. Plants, farming, and food was abundant everywhere.\n\n\n[press SPACE to continue]";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill('#694205');
    textAlign(CENTER);
    textSize(30);
    textFont(fontNarrativeText);

    // Draw text in a box
    text(this.instructionsText, this.textBoxX, this.textBoxY, this.textBoxWidth, this.textBoxHeight );
  }
}

// Narrative Intro Two
class narrativeIntroTwoRoom extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4;
    this.textBoxX = 200;
    this.textBoxY = 215;

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "The relentless search for hidden treasures around the world has destroyed the land as we know it. Sweetfield City is now seen as a dangerous, unsafe, and grim place. Once glorious, its sweetfields are now desolate, its air toxic, and its people divided, all thanks to the unrelenting men of neighboring city of Goldfolk. A young Felicity Walker is Sweetfield’s only hope! Will you help Felicity stop her hometown from becoming a Sacrifice Zone?\n\n\n[press SPACE to continue]";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill('#694205');
    textAlign(CENTER);
    textSize(30);
    textFont(fontNarrativeText);

    // Draw text in a box
    text(this.instructionsText, this.textBoxX, this.textBoxY, this.textBoxWidth, this.textBoxHeight );
  }
}

// Instructions
class instructionsRoom extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "HOW TO PLAY\n\nPress SPACEBAR to move on to the next levels, and the ARROW KEYS to navigate Felicity around Sweetfield and Goldfolk City. Press F for full screen Mode.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill('#694205');
    textAlign(CENTER);
    textSize(30);
    textFont(fontNarrativeText);

    // Draw text in a box
    text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}

// Level One: Basic Needs Room
class levelOneBasicNeedsRoom extends PNGRoom {
  // preload() gets called once upon startup
  // We load ONE animation and create 20 NPCs
  preload() {
    this.foodNPC = null;

    this.foodX = 200;
    this.foodY = 550;
    this.foodWidth = 100;
    this.foodHeight = 53;
  }

  //load() gets called whenever you enter a room
  load() {
     super.load();

      this.foodSprite = createSprite(this.foodX, this.foodY, this.foodWidth, this.foodHeight);
      this.foodSprite.addAnimation('idle', loadAnimation('assets/clickables/food.png'));
  }

  // pass draw function to superclass, then draw sprites, then check for overlap
  draw() {
    
    super.draw();
    drawSprite(this.foodSprite);
    this.foodSprite.setCollider('rectangle', 0, 0, 30, 30);
    playerSprite.collide(this.foodSprite);

    // fill(255);
    // textAlign(CENTER);
    // textSize(40);
    // text("Get out of SWEETFIELD!", width/2, height/2)

    // draw our dialog box here...
    if( playerSprite.overlap(this.foodSprite)) {
      // draw a PNG file here of the dialog box...
      narrativeVisible = true;
      currentLevel = 'Level 1: Basic Needs';
      currentNarrative = 'Sweetfield City is in DANGER! Air is too toxic to breathe. First,\nfind some food to take with you, then get out of Sweetfield!';
    }
    else {
      narrativeVisible = false;
      currentLevel = '';
      currentNarrative = '';
    }
  }

  // gets called when you leave a room
  unload()  {
      super.unload();

      // you would unload it here
      this.foodNPC = null;
      narrativeVisible = false;
  }
}

// Level Two:  Safety Room
class levelTwoSafetyRoom extends PNGRoom {
  preload() {
    this.maskNPC = null;
    this.maskX = 600;
    this.maskY = 550;
  }
  load() {
     super.load();
     this.maskSprite = createSprite(this.maskX, this.maskY, 100, 53);
  }
  draw() {
    super.draw();
    drawSprite(this.foodSprite);
    this.maskSprite.setCollider('rectangle', 0, 0, 100, 30);
    playerSprite.collide(this.maskSprite);

    // draw our dialog box here...
    if( playerSprite.overlap(this.maskSprite)) {
      // draw a PNG file here of the dialog box...
      narrativeVisible = true;
      currentLevel = 'Level 2: Safety';
      currentNarrative = 'The air is too toxic to breathe. Take this mask with you and follow\nthe path to continue your journey. By the way, where did everyone go?\nYou should try heading to Sweet Forest to find out.';
    }
    else {
      narrativeVisible = false;
      currentLevel = '';
      currentNarrative = '';
    }
  }

  unload()  {
      super.unload();

      // you would unload it here
      this.maskNPC = null;
      narrativeVisible = false;
  }
}

// Level Three A: Belongingness Room
class LevelThreeABelongingnessRoom extends PNGRoom {
  preload() {
    this.npcGirlSprite = false;
    this.npcGirlX = 770;
    this.npcGirlY = 133;
    this.npcGirlWidth = 200;
    this.npcGirlHeight = 200;

    this.npcMomAndChildSprite = false;
    this.npcMomAndChildX = 1130;
    this.npcMomAndChildY = 330;
    this.npcMomAndChildWidth = 150;
    this.npcMomAndChildHeight = 150;
  }

  load() {
     super.load();
     this.npcGirlSprite = createSprite(this.npcGirlX, this.npcGirlY, this.npcGirlWidth, this.npcGirlHeight);
     this.npcGirlSprite.addAnimation('idle', loadAnimation('assets/avatars/npcGirl.png'));
     this.npcMomAndChildSprite = createSprite(this.npcMomAndChildX, this.npcMomAndChildY, this.npcMomAndChildWidth, this.npcMomAndChildHeight);
     this.npcMomAndChildSprite.addAnimation('idle', loadAnimation('assets/avatars/npcMomAndChild.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.npcGirlSprite);
    this.npcGirlSprite.setCollider('rectangle', 0, -20, 30, 30);
    playerSprite.collide(this.npcGirlSprite);

    drawSprite(this.npcMomAndChildSprite);

    // draw our dialog box here...
    if( playerSprite.overlap(this.npcGirlSprite)) {
      // draw a PNG file here of the dialog box...
      narrativeVisible = true;
      currentLevel = 'Level 3: Belongingness';
      currentNarrative = 'Hi Felicity! Thank you for rescuing us in the forest. We are very\nconfused as to what is happening in our town...I sure hope you can\nfind the others because many of us are lost.';
    }
    else {
      narrativeVisible = false;
      currentLevel = '';
      currentNarrative = '';
    }
  }
  unload() {
      super.unload();

      // you would unload it here
      this.npcGirlSprite = false;
      this.MomAndChildSprite = false;
      narrativeVisible = false;
  }
}

// Level Three B: Belongingness Room
// Level Four A: Esteem Room
class LevelFourAEsteemRoom extends PNGRoom {
  preload() {
    this.arrowsSprite = false;
    this.arrowsX = 600;
    this.arrowsY = 500;
    this.arrowsWidth = 200;
    this.arrowsHeight = 29;
  }

  load() {
     super.load();
     this.arrowsSprite = createSprite(this.arrowsX, this.arrowsY, this.arrowsWidth, this.arrowsHeight);
     this.arrowsSprite.addAnimation('idle', loadAnimation('assets/arrows.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.arrowsSprite);
    this.arrowsSprite.setCollider('rectangle', 0, 0, 30, 30);
    playerSprite.collide(this.arrowsSprite);

    // draw our dialog box here...
    if( playerSprite.overlap(this.arrowsSprite)) {
      // draw a PNG file here of the dialog box...
      narrativeVisible = true;
      currentLevel = 'Level 4: Esteem';
      currentNarrative = 'You have finally reached the neighboring city of Goldfolk! Wow.\nThis place looks so much better than Sweetfield right now. The air is\neven fresh and clean. Keep moving and you might discover how they do it.';
    }
    else {
      narrativeVisible = false;
      currentLevel = '';
      currentNarrative = '';
    }
  }
  unload() {
      super.unload();

      // you would unload it here
      this.arrowsSprite = false;
      narrativeVisible = false;
  }
}

// Level Four B: Esteem Room
class LevelFourBEsteemRoom extends PNGRoom {
  preload() {
    this.davidHumbleSprite = false;
    this.davidHumbleX = 600;
    this.davidHumbleY = 550;
    this.davidHumbleWidth = 50;
    this.davidHumbleHeight = 53;
  }

  load() {
     super.load();
     this.davidHumbleSprite = createSprite(this.davidHumbleX, this.davidHumbleY, this.davidHumbleWidth, this.davidHumbleHeight);
     this.davidHumbleSprite.addAnimation('idle', loadAnimation('assets/avatars/davidHumble.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.davidHumbleSprite);
    this.davidHumbleSprite.setCollider('rectangle', 0, 0, 30, 30);
    playerSprite.collide(this.davidHumbleSprite);

    // draw our dialog box here...
    if( playerSprite.overlap(this.davidHumbleSprite)) {
      // draw a PNG file here of the dialog box...
      narrativeVisible = true;
      currentLevel = 'Level 4: Esteem';
      currentNarrative = 'Sir David Humble: Hi! Welcome to my city. I see that you are\nlooking for something to tell you about our famous crops. You are\nwelcome to use our research library if you like? [press E to enter]';
    }
    else {
      narrativeVisible = false;
      currentLevel = '';
      currentNarrative = '';
    }
  }
  unload() {
      super.unload();

      // you would unload it here
      this.davidHumbleSprite = false;
      narrativeVisible = false;
  }
}
// Level Five A: Knowledge Room
class LevelFiveAKnowledgeRoom extends PNGRoom {
  preload() {
    this.sweetflowerTubesSprite = false;
    this.sweetflowerTubesX = 650;
    this.sweetflowerTubesY = 550;
    this.sweetflowerTubesWidth = 50;
    this.sweetflowerTubesHeight = 53;
  }

  load() {
     super.load();
     this.sweetflowerTubesSprite = createSprite(this.sweetflowerTubesX, this.sweetflowerTubesY, this.sweetflowerTubesWidth, this.sweetflowerTubesHeight);
     this.sweetflowerTubesSprite.addAnimation('idle', loadAnimation('assets/sweetflowerTubes.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.sweetflowerTubesSprite);
    this.sweetflowerTubesSprite.setCollider('rectangle', 0, 0, 30, 30);
    playerSprite.collide(this.sweetflowerTubesSprite);

    // draw our dialog box here...
    if( playerSprite.overlap(this.sweetflowerTubesSprite)) {
      // draw a PNG file here of the dialog box...
      narrativeVisible = true;
      currentLevel = 'Level 5: Knowledge';
      currentNarrative = 'Woah. Felicity stumbled into the secret room. Why do these\ntubes contain plants? They look familiar too...They are all over Goldfolk City!';
    }
    else {
      narrativeVisible = false;
      currentLevel = '';
      currentNarrative = '';
    }
  }
  unload() {
      super.unload();

      // you would unload it here
      this.davidHumbleSprite = false;
      narrativeVisible = false;
  }
}

// Level Five B: Knowledge Room
// Level Six: Self-Actualization Room
class LevelSixSelfActualizationRoom extends PNGRoom {
  preload() {
    this.arrowsSprite = false;
    this.arrowsX = 600;
    this.arrowsY = 500;
    this.arrowsWidth = 200;
    this.arrowsHeight = 29;
  }

  load() {
     super.load();
     this.arrowsSprite = createSprite(this.arrowsX, this.arrowsY, this.arrowsWidth, this.arrowsHeight);
     this.arrowsSprite.addAnimation('idle', loadAnimation('assets/arrows.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.arrowsSprite);
    this.arrowsSprite.setCollider('rectangle', 0, 0, 30, 30);
    playerSprite.collide(this.arrowsSprite);

    // draw our dialog box here...
    if( playerSprite.overlap(this.arrowsSprite)) {
      // draw a PNG file here of the dialog box...
      narrativeVisible = true;
      currentLevel = 'Level 4: Esteem';
      currentNarrative = 'Felicity discovered something, that for sure. Her hometown became\na Sacrifice Zone!? And now her folks are suffering, and\nworst of all their crops are taken away. Go back to Sweetfield to\nreplant the sweetflower.';
    }
    else {
      narrativeVisible = false;
      currentLevel = '';
      currentNarrative = '';
    }
  }
  unload() {
      super.unload();

      // you would unload it here
      this.arrowsSprite = false;
      narrativeVisible = false;
  }
}

// Level Seven: Transcendence Room
// Sweetfield Saved A Room

// Sweetfield Saved B  Room
class sweetfieldSavedBRoom extends PNGRoom {
  preload() {
    // variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4;
    this.textBoxX = 200;
    this.textBoxY = 215;

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "Congratulations! You made it to the end. Thanks to your help, Felicity and the Freedom Fighters were able to restore Sweetfield City's glory. Best of all, her town has microfarms that provide food for folks!\n\n\n[SPACE]";
  }

  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
      
    fill('#694205');
    textAlign(CENTER);
    textSize(40);
    textFont(fontNarrativeText);

    text(this.instructionsText, this.textBoxX, this.textBoxY, this.textBoxWidth, this.textBoxHeight );
  }
}

// Narrative Ending Room
class narrativeEndingRoom extends PNGRoom {
  preload() {
    // variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4;
    this.textBoxX = 200;
    this.textBoxY = 215;
    this.instructionsText = "Sustainable microfarms help bring people closer to the food they eat, creating transparency in the food chain and the opportunity to combat environmental injustices such as 'food deserts' and shortages. Visit www.thrivesantaana.org to learn how cities like Santa Ana does it.\n\n\n[SPACE]";
  }

  draw() {
    tint(125);
    super.draw();
    fill('#FFFFFF');
    textAlign(CENTER);
    textSize(40);
    textFont(fontNarrativeText);
    text(this.instructionsText, this.textBoxX, this.textBoxY, this.textBoxWidth, this.textBoxHeight );
  }
}

