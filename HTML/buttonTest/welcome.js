/* TO DO

slider bar
connect all the pieces

*/

var origin, width, height, margin, selected, requiredAnswers, hue;

var currentQuestion;

var exitMenu;

var navBar;

var welcomeButton;

var backButton;
var forwardButton;

function setup() {
	createCanvas(windowWidth, windowHeight);

	hue = 201;

	width 	= windowWidth/6;
	height 	= windowHeight/4;
	origin 	= createVector(windowWidth/2-width, windowHeight/2-height);

	welcomeButton = new WelcomeButton(origin, width*2, height, "Welcome", [hue, 100, 100]);

	navBar = new NavigationBar();

	backButton = new NavigationButton(createVector(50, windowHeight/2), true, -1);
	forwardButton = new NavigationButton(createVector(windowWidth-50, windowHeight/2 ), false, 1);

	exitMenu = new ExitMenu(createVector(windowWidth/2, windowHeight*.35));

}

function draw() {

	background(255);

	welcomeButton.display();

	// displayQuestion();
	// navBar.display();
	// backButton.display(hue);
	// forwardButton.display(hue);
	// exitMenu.display();
	// checkAnswerCount();

}

function mousePressed(){

	if (mouseX > welcomeButton.origin.x && mouseX <welcomeButton.origin.x+welcomeButton.width){
		if (mouseY > welcomeButton.origin.y && mouseY < welcomeButton.origin.y+welcomeButton.height){
			console.log("Welcome Button Clicked");
			welcomeButton.selected = true;

			// setTimeout(submitAnswers("http://localhost:4000/survey"), 50);
			setTimeout(window.open("http://localhost:4000/survey", "_self"), 50);
		}
	}	
}


var checkButtons = function(callback){

	var answerString = "";

	// loop through all of the selected buttons
	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].selected){
			if (answerString.length == 0){
				// if there hasn't been anything added to the answer string, add it
				answerString = "?a"+[i]+"=1";
			} else {
				// if the answer string already has some content, include and ampersand first
				answerString.concat("&a"+[i]+"=1");
			}						
		}
	};

	console.log("http://localhost:4000/next"+answerString);
	callback("http://localhost:4000/next"+answerString);

}


function checkAnswerCount(){

	var answerCount = 0;

	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].selected) answerCount++;
	};

	if (answerCount == requiredAnswers){
		forwardButton.active = true;
	} else {
		forwardButton.active = false;
	}

}

function displayQuestion(_question){

	push();
		translate(windowWidth/2, 65);
		translate(this.buttonWidth/2, this.buttonHeight/2);
		fill(0);
		textSize(36);
		textAlign(CENTER, CENTER);
		rectMode(CENTER);
		text(currentQuestion,0,0, windowWidth*.6, 75);	
		
		push();
			translate(0,75);
			fill(0);
			textSize(18);
			textAlign(CENTER, CENTER);
			rectMode(CENTER);
			if(requiredAnswers > 1){
				text("[ Select "+requiredAnswers+ " Answers ]",0,0, windowWidth*.6, 100);
			} else {
				text("[ Select "+requiredAnswers+ " Answer ]",0,0, windowWidth*.6, 100);
			}
			
		pop();

	pop();

}

function setupButtons(){

	// if (jsonObject.answers.length > 4){
	// 	height = windowHeight*.15;
	// } else {
	// 	height = windowHeight*.25;
	// }

	requiredAnswers = jsonObject.type;
	currentQuestion = jsonObject.question;
	origin = createVector(windowWidth*.2, 200);
	width = windowWidth*.3;
	margin = height*.25;
	images = jsonObject.images;

	var selectedAnswers = new Array(jsonObject.answers.length);

	for (var i = 0; i < jsonObject.answers.length; i++) {

		var button = new Button(origin, width, height, jsonObject.answers[i], [hue, 204, 100], images[i]);
		buttons.push(button);

		origin.x += width + margin;

		if (origin.x > windowWidth*.6) {
			origin.x = windowWidth*.2;
			origin.y += height+margin;
		} 
	};
}

function clearButtons(){
	for (var i = 0; i < buttons.length; i++) {
		buttons.splice(buttons[i]);
	};
}

// =================================================================
// =================== AJAX CALL TO SERVER =========================
// =================================================================

function submitAnswers(_answerString) {
  var xhttp = new XMLHttpRequest();  

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
    	console.log (xhttp.responseText);
    }
  }

  //submit
  console.log("Sending: "+_answerString);
  xhttp.open("GET", _answerString, true);
  xhttp.send();

}