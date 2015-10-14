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
        this.createCell( cells[i].x, cells[i].y );
    }
    this.render('body');
}

Board.prototype.addRow = function() {
    var row = [];
    for ( var i = 0; i < this.width; i++ ) {
        row.push(DEAD_CELL);
    }
    this.rows.push(row);
}

Board.prototype.isPositionValid = function( x, y ) {
    return ( x >= 0 && y >= 0 && x < this.width && y < this.height );
}

Board.prototype.isCellAlive = function( x, y ) {
    return this.isPositionValid( x, y ) && this.rows[x][y] === LIVE_CELL;
}

Board.prototype.createCell = function( x, y ) {
    this.rows[x][y] = LIVE_CELL;
}

Board.prototype.killCell = function( x, y ) {
    this.rows[x][y] = DEAD_CELL;
}

Board.prototype.getCellNeighboursCount = function ( x, y ) {

    var neighbours = 0;

    if ( this.isCellAlive( x - 1, y - 1 ) ) neighbours ++;
    if ( this.isCellAlive( x - 1, y ) ) neighbours ++;
    if ( this.isCellAlive( x - 1, y + 1) ) neighbours ++;

    if ( this.isCellAlive( x , y - 1) ) neighbours ++;
    if ( this.isCellAlive( x , y + 1) ) neighbours ++;

    if ( this.isCellAlive( x + 1 , y - 1) ) neighbours ++;
    if ( this.isCellAlive( x + 1 , y ) ) neighbours ++;
    if ( this.isCellAlive( x + 1 , y + 1) ) neighbours ++;

    return neighbours;
}

Board.prototype.evolve = function () {
    var self = this;

    self.rows.forEach( function( row, x, array ) {
        row.forEach( function( cell, y, array) {
            var neighbours = self.getCellNeighboursCount( x, y );
            if ( neighbours < 2 || neighbours > 3) {
                self.killCell( x, y );
            } else if ( neighbours === 3 ) {
                self.createCell( x, y );
            }
        });
    });
}

Board.prototype.render = function( el ) {
    var self = this;
    var $board = $('<div class="board"></div>');
    var $row = null;
    var $cell = null;

    $.each(self.rows, function( x, row ) {

        $row = $('<div class="row"></div>');

        $.each(row, function( y, cell ) {
            $cell = $('<div class="cell ' + ( self.isCellAlive( x, y ) ? 'live' : 'dead' ) + '"></div>');
            $row.append($cell);
        });

        $board.append($row);
    });

    $(el).html($board);
}
