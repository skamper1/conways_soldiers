//script can be intialised before page load

// global methods and variables
let window_height, window_width, move_change, move_distance, game_state, starting_checkers;
const PIECE_ASSIGNMENT = "PIECE_ASSIGNMENT";
const PIECE_MOVEMENT = "PIECE_MOVEMENT";
const AWAITING_RESET = "AWAITING_RESET";
const checkerboard = document.getElementById("checkerboard");
const board_width = 10;
const board_height = 10;
getMoveDimensions();

// game_state can have the values piece_assignment, piece_movement or awaiting_reset
game_state = PIECE_ASSIGNMENT;
const play_button = document.getElementById("play_button");
play_button.addEventListener("click", function () {
    if (game_state == PIECE_ASSIGNMENT) {
        game_state = PIECE_MOVEMENT;
        this.innerText = "Reset";
        setStartingCheckersString();
        setSaveURL();
    } else {
        game_state = PIECE_ASSIGNMENT;
        this.innerText = "Play";
        setStartingCheckersLocations();
    }
})

let url = new URL(window.location.href);
//get the parameter starting_checkers
starting_checkers = url.searchParams.get("starting_checkers") !== null ? url.searchParams.get("starting_checkers") : "55,56";

//starting_checkers is a variable which is set when play is clicked, encoding as a string so we could pass in values

let starting_checkers_locations = starting_checkers.split(",");

function getWindowDimensions() {
    window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function getMoveDimensions() {
    getWindowDimensions();
    move_change = window_width > 640 ? 10 : 6;
    move_distance = window_width > 640 ? 80 : 50;
}

//set the string when play begins to record start locations
function setStartingCheckersString() {
    //clear starting checkers locations
    starting_checkers_locations = []
    for (let i = 0; i < soldier_checkers.length; i++) {
        starting_checkers_locations.push(soldier_checkers[i].square_number);
    }
    starting_checkers_locations.sort();
    starting_checkers = starting_checkers_locations.join(",");
}

function setStartingCheckersLocations() {
    starting_checkers_locations = starting_checkers.split(",");
    for (let i = 0; i < squares.length; i++) {
        let square = squares[i];
        if (square.occupied) {
            square.checker.destroyPiece();
        }
    }
    Square.removeHighlightedSquares();
    for (let i = 0; i < starting_checkers_locations.length; i++) {
        let index = parseInt(starting_checkers_locations[i]);
        squares[index - 1].addChecker();
    }
}

function setSaveURL() {
    let saveurl = url.href.split("?")[0] + "?starting_checkers=" + starting_checkers;
    document.getElementById("saveurl").href = saveurl;
    document.getElementById("saveurl").innerText = saveurl;
}

class Checker {
    static highlighted_checker = null;
    constructor(html_element, square_number) {
        //constructor
        this.html_element = html_element;
        this.html_element.checker = this;
        this.html_element.addEventListener("click", function () { this.checker.clickevent() });
        this.square_number = square_number;

        this.x = (square_number - 1) % board_width + 1;
        this.y = Math.floor((square_number - 1) / board_width) + 1;
        this.#setCoordinates();
        squares[this.square_number - 1].checker = this;
        squares[this.square_number - 1].occupied = true;
    }

    static removeHighlightedChecker() {
        if (Checker.highlighted_checker !== null) {
            Checker.highlighted_checker.removeHighlight();
            Checker.highlighted_checker = null;
        }
    }

    moveToSquare(square_number) {
        this.x = (square_number - 1) % board_width + 1;
        this.y = Math.floor((square_number - 1) / board_width) + 1;
        this.#setCoordinates();
        squares[this.square_number - 1].checker = null;
        squares[this.square_number - 1].occupied = false;
        this.square_number = square_number;
        squares[this.square_number - 1].checker = this;
        squares[this.square_number - 1].occupied = true;
    }


    #setCoordinates() {
        //sets up geometry
        let x_px = (this.x - 1) * move_distance + move_change;
        let y_px = (this.y - 1) * move_distance + move_change;
        this.html_element.style.top = y_px + "px";
        this.html_element.style.left = x_px + "px";
    }

    addHighlight() {
        this.html_element.style.backgroundColor = "#6a2150";
        Checker.highlighted_checker = this;
    }

    removeHighlight() {
        this.html_element.style.backgroundColor = null;
    }

    // added for completeness using the Soldier Checker version
    clickevent() {


    }
}

// Specific Conway Soldiers Game Logic
class SoldierChecker extends Checker {
    constructor(html_element, square_number) {
        super(html_element, square_number);

    }


    clickevent() {
        if (game_state == PIECE_ASSIGNMENT) {
            //remove piece
            this.destroyPiece();
        } else {
            if (game_state == PIECE_MOVEMENT) {
                Checker.removeHighlightedChecker();
                this.addHighlight();
                //remove old highlights if any
                Square.removeHighlightedSquares();
                //find out where potential squares are
                let potential_square_numbers = [];
                if (this.y > 2) {
                    let adjacent_square_number = this.square_number - board_width;
                    let potential_square_number = this.square_number - 2 * board_width;
                    let adjacent_square = squares[adjacent_square_number - 1];
                    let potential_square = squares[potential_square_number - 1];
                    if (adjacent_square.occupied && !potential_square.occupied) {
                        potential_square.highlight(this, adjacent_square);
                    }

                }
                if (this.x < board_width - 1) {
                    let adjacent_square_number = this.square_number + 1;
                    let potential_square_number = this.square_number + 2;
                    let adjacent_square = squares[adjacent_square_number - 1];
                    let potential_square = squares[potential_square_number - 1];
                    if (adjacent_square.occupied && !potential_square.occupied) {
                        potential_square.highlight(this, adjacent_square);
                    }

                }
                if (this.y < board_width - 1) {
                    let adjacent_square_number = this.square_number + board_width;
                    let potential_square_number = this.square_number + 2 * board_width;
                    let adjacent_square = squares[adjacent_square_number - 1];
                    let potential_square = squares[potential_square_number - 1];
                    if (adjacent_square.occupied && !potential_square.occupied) {
                        potential_square.highlight(this, adjacent_square);
                    }

                }
                if (this.x > 2) {
                    let adjacent_square_number = this.square_number - 1;
                    let potential_square_number = this.square_number - 2;
                    let adjacent_square = squares[adjacent_square_number - 1];
                    let potential_square = squares[potential_square_number - 1];
                    if (adjacent_square.occupied && !potential_square.occupied) {
                        potential_square.highlight(this, adjacent_square);
                    }

                }
                console.log(`checker in square number ${this.square_number} click event`);
            }

        }
    }



    destroyPiece() {
        //removes from board and lists
        let square = squares[this.square_number - 1];
        square.checker = null;
        square.occupied = false;
        checkerboard.removeChild(this.html_element);
        let index = soldier_checkers.indexOf(this);
        soldier_checkers.splice(index, 1);
    }

}

class Square {
    static highlighted_squares = [];

    constructor(html_element, square_number) {
        this.html_element = html_element;
        this.square_number = square_number;
        this.html_element.square = this;
        this.html_element.addEventListener("click", function () { this.square.clickevent() });
        this.occupied = false;
        this.checker = null;
        this.highlighted = false;
        this.potential_checker = null;
    }

    static removeHighlightedSquares() {
        const n = this.highlighted_squares.length;
        for (let i = 0; i < n; i++) {
            let highlighted_square = Square.highlighted_squares.pop();
            highlighted_square.removeHighlight();
        }
    }

    addColour() {
        this.html_element.style.border = "10px solid #e3ba12";
    }

    removeColour() {
        this.html_element.style.border = null;
    }
    // the click event that will have different scenarios based on state of game.
    clickevent() {
        if (game_state == PIECE_ASSIGNMENT) {
            if (!this.occupied & this.square_number > 50) {
                this.addChecker();
            }
            //else use checker event
        } else {
            if (game_state == PIECE_MOVEMENT) {
                if (!this.occupied) {
                    if (this.highlighted) {
                        this.potential_checker.moveToSquare(this.square_number);
                        this.adjacent_square.checker.destroyPiece();
                        Square.removeHighlightedSquares();
                        Checker.removeHighlightedChecker();
                        console.log(`square number ${this.square_number} click event`);
                    }
                    //else no movement
                }
                //else use checker event only
            }
            //else no moves possible (game_state AWAITING RESET)
        }
    }

    addChecker() {
        if (!this.occupied) {
            let checker = document.createElement("div");
            checker.classList.add("checker");
            soldier_checkers.push(new SoldierChecker(checker, this.square_number));
            checkerboard.appendChild(checker);
            this.occupied = true;
        } else {
            console.log("error square already occupied");
        }
    }

    highlight(potential_checker, adjacent_square) {
        if (!this.occupied) {
            this.addColour();
            this.potential_checker = potential_checker;
            this.adjacent_square = adjacent_square;
            this.highlighted = true;
            Square.highlighted_squares.push(this);
        }
    }

    removeHighlight() {
        if (this.highlighted) {
            this.highlighted = false;
            this.removeColour();
            this.potential_checker = null;
            this.adjacent_square = null;
        }
    }
}




let square_elements = document.getElementsByClassName("square");

let soldier_checkers = [];
let squares = [];


for (let i = 0; i < square_elements.length; i++) {
    squares[i] = new Square(square_elements[i], i + 1);
}

setStartingCheckersLocations();
setSaveURL();

const animate = url.searchParams.get("animate");
if (animate !== null) {
    play_button.click();
    const animate_parts = animate.split(",");
    let timeout = 0;
    for (let i = 0; i < animate_parts.length; i += 2) {
        let j = parseInt(animate_parts[i]);
        let k = parseInt(animate_parts[i + 1]);
        console.log("j is " + j + " k is " + k);
        timeout += 1000;
        setTimeout(function () { squares[j - 1].checker.clickevent() }, timeout);
        timeout += 1000;
        setTimeout(function () { squares[k - 1].clickevent() }, timeout);
    }
}

