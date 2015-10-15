var DEAD_CELL = 0;
var LIVE_CELL = 1;

function Board(size) {
    this.width = size;
    this.height = size;
    this.rows = [];

    for ( var i = 0; i < this.height; i++ ) {
        this.addRow();
    }
}

Board.prototype.initialize = function ( cells ) {
    for ( var i = 0; i < cells.length; i ++ ) {
        this.createCell( cells[i].y, cells[i].x );
    }
    this.render();
}

Board.prototype.addRow = function() {
    var row = [];
    for ( var i = 0; i < this.width; i++ ) {
        row.push(DEAD_CELL);
    }
    this.rows.push(row);
}

Board.prototype.isPositionValid = function( y, x ) {
    return ( x >= 0 && y >= 0 && x < this.width && y < this.height );
}

Board.prototype.isCellAlive = function( y, x ) {
    return this.isPositionValid( y, x ) && this.rows[y][x] === LIVE_CELL;
}

Board.prototype.createCell = function( y, x ) {
    this.rows[y][x] = LIVE_CELL;
}

Board.prototype.killCell = function( y, x ) {
    this.rows[y][x] = DEAD_CELL;
}

Board.prototype.getCellNeighboursCount = function ( y, x ) {

    var neighbours = 0;

    if ( this.isCellAlive( y - 1, x - 1 ) ) neighbours ++;
    if ( this.isCellAlive( y - 1, x ) ) neighbours ++;
    if ( this.isCellAlive( y - 1, x + 1) ) neighbours ++;

    if ( this.isCellAlive( y , x - 1) ) neighbours ++;
    if ( this.isCellAlive( y , x + 1) ) neighbours ++;

    if ( this.isCellAlive( y + 1 , x - 1) ) neighbours ++;
    if ( this.isCellAlive( y + 1 , x ) ) neighbours ++;
    if ( this.isCellAlive( y + 1 , x + 1) ) neighbours ++;

    return neighbours;
}

Board.prototype.evolve = function () {
   var self = this;
   var birthsAndDeaths = [];

    self.rows.forEach( function( row, y, array ) {
        row.forEach( function( cell, x, array) {
            var neighbours = self.getCellNeighboursCount( y, x );
            if ( ( neighbours < 2 || neighbours > 3 ) && self.isCellAlive( y, x ) ) {
                birthsAndDeaths.push({ x: x, y: y, state: DEAD_CELL});
            } else if ( neighbours === 3 && !self.isCellAlive( y, x ) ) {
                birthsAndDeaths.push({ x: x, y: y, state: LIVE_CELL});
            }
        });
    });

    birthsAndDeaths.forEach( function( element ) {
        if ( element.state === DEAD_CELL ) self.killCell( element.y, element.x );
        else self.createCell( element.y, element.x );
    });
}

Board.prototype.render = function() {
    var self = this;

    var boardDiv = document.createElement('div');
    var rowDiv = null;
    var cellDiv = null;

    self.rows.forEach(function( row, y ) {
        rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        row.forEach(function( cell, x ) {
            cellDiv = document.createElement('div');
            cellDiv.className = 'cell ' + (self.isCellAlive( y, x ) ? 'live' : 'dead');
            rowDiv.appendChild(cellDiv);
        });

        boardDiv.appendChild(rowDiv);
    });
    boardDiv.className = 'board';
    document.body.innerHTML = boardDiv.outerHTML;
}
