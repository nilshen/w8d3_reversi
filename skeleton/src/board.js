// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];
  for (let i = 0; i < 8; i++) {
    grid.push([undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined])   
  }

  grid[3][4] = new Piece('black');
  grid[4][3] = new Piece('black');
  grid[3][3] = new Piece('white');
  grid[4][4] = new Piece('white');

  return grid;
};

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  if (pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7)
    { return false;} else {
      return true;
    }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {

  let x = pos[0];
  let y = pos[1];
    if (this.isValidPos(pos)) {
      return this.grid[x][y]
    } else {
      throw new Error("Not valid pos!");
    }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let x = pos[0];
  let y = pos[1];
  if (this.grid[x][y] === undefined) {
      return false;    
  };

  if (this.grid[x][y].color === color) {
    return true;
  }  else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let x = pos[0];
  let y = pos[1];

    if (this.grid[x][y] !== undefined) {
        return true;    
    } else {
        return false;
    };
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip) {
if (piecesToFlip === undefined) {
  piecesToFlip = [];
}
  else {
  piecesToFlip.push(pos) 
}

let xOneAway = pos[0]+dir[0];
let yOneAway = pos[1]+dir[1];
let nextPosition = [xOneAway, yOneAway];
if(this.isValidPos(pos) === false) {
  return []
}
else if(this.isValidPos(nextPosition) === false) {
return []
}
else if (!this.isOccupied(nextPosition)) {
  return []
}
else if (this.isMine(nextPosition, color)) {
  return piecesToFlip;
}
else {
return this._positionsToFlip(nextPosition, color, dir, piecesToFlip);
};

};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
    if (this.isOccupied(pos)) {
      return false
    }
  let valid = false
   Board.DIRS.forEach(direction=>{
     if (this._positionsToFlip(pos, color, direction).length !== 0) {
      valid = true;
     }
    })

return valid;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (this.validMove(pos, color)) {
    let piecesToFlip = [];

    Board.DIRS.forEach(direction => 
       piecesToFlip.push(this._positionsToFlip(pos, color, direction))
      )
      let piecesToFlipFlatten = piecesToFlip.flat();
          piecesToFlipFlatten.forEach(position => 
            this.grid[position[0]][position[1]].color = color
          )
        this.grid[pos[0]][pos[1]] = new Piece(color);

  } else {
    throw new Error("Invalid move!");
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validPosition = [];
  for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++){
       if (this.validMove([i,j], color)) {
         validPosition.push([i,j])
       }
      }
    }
    return validPosition;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length === 0) {
    return false;
  }
  return true;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
 return (!this.hasMove('white')) && (!this.hasMove('black'))
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE