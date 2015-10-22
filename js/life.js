/*jslint browser: true */
/*global document: false */
/*jslint plusplus: true */

var DEAD_CELL = 0;
var LIVE_CELL = 1;

function Board(size) {
    'use strict';

    this.width = size;
    this.height = size;

    this.reset();
}

Board.prototype.reset = function () {
    'use strict';

    var i;
    this.rows = [];

    for (i = 0; i < this.height; i++) {
        this.addRow();
    }
};

Board.prototype.initialize = function (cells) {
    'use strict';

    var i;

    for (i = 0; i < cells.length; i++) {
        this.createCell(cells[i].x, cells[i].y);
    }
    this.render();
};

Board.prototype.addRow = function () {
    'use strict';

    var i, row = [];

    for (i = 0; i < this.width; i++) {
        row.push(DEAD_CELL);
    }

    this.rows.push(row);
};

Board.prototype.isPositionValid = function (x, y) {
    'use strict';
    return (x >= 0 && y >= 0 && x < this.width && y < this.height);
};

Board.prototype.isCellAlive = function (x, y) {
    'use strict';
    return this.isPositionValid(x, y) && this.rows[y][x] === LIVE_CELL;
};

Board.prototype.createCell = function (x, y) {
    'use strict';
    this.rows[y][x] = LIVE_CELL;
};

Board.prototype.killCell = function (x, y) {
    'use strict';
    this.rows[y][x] = DEAD_CELL;
};

Board.prototype.getCellNeighboursCount = function (x, y) {
    'use strict';

    var neighbours = 0;

    if (this.isCellAlive(x, y - 1)) { neighbours++; }
    if (this.isCellAlive(x, y + 1)) { neighbours++; }

    if (this.isCellAlive(x + 1, y - 1)) { neighbours++; }
    if (this.isCellAlive(x + 1, y)) { neighbours++; }
    if (this.isCellAlive(x + 1, y + 1)) { neighbours++; }

    if (this.isCellAlive(x - 1, y)) { neighbours++; }
    if (this.isCellAlive(x - 1, y + 1)) { neighbours++; }
    if (this.isCellAlive(x - 1, y - 1)) { neighbours++; }

    return neighbours;
};

Board.prototype.evolve = function () {
    'use strict';

    var self = this,
        birthsAndDeaths = [],
        neighbours,
        element,
        i,
        x,
        y;

    for (y = 0; y < self.rows.length; y++) {
        for (x = 0; x < self.rows[y].length; x++) {
            neighbours = self.getCellNeighboursCount(x, y);
            if ((neighbours < 2 || neighbours > 3) && self.isCellAlive(x, y)) {
                birthsAndDeaths.push({ x: x, y: y, state: DEAD_CELL});
            } else if (neighbours === 3 && !self.isCellAlive(x, y)) {
                birthsAndDeaths.push({ x: x, y: y, state: LIVE_CELL});
            }
        }
    }

    for (i = 0; i < birthsAndDeaths.length; i++) {
        element = birthsAndDeaths[i];
        if (element.state === DEAD_CELL) {
            self.killCell(element.x, element.y);
        } else {
            self.createCell(element.x, element.y);
        }
    }
};

Board.prototype.render = function (container) {
    'use strict';

    var self = this,
        boardDiv = document.createElement('div'),
        rowDiv,
        cellDiv,
        x,
        y;

    container = container || 'container';

    for (y = 0; y < self.rows.length; y++) {
        rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        for (x = 0; x < self.rows[y].length; x++) {
            cellDiv = document.createElement('div');
            cellDiv.className = 'cell ' + (self.isCellAlive(x, y) ? 'live' : 'dead');
            rowDiv.appendChild(cellDiv);
        }

        boardDiv.appendChild(rowDiv);
    }

    boardDiv.className = 'board';
    document.getElementsByClassName(container)[0].innerHTML = boardDiv.outerHTML;
};

Board.prototype.getCoordinates = function (container) {
    'use strict';

    var rows = document.getElementsByClassName('row'),
        cells,
        hasClass = false,
        result = [],
        x,
        y;

    container = container || 'container';

    for (y = 0; y < rows.length; y++) {
        cells = rows[y].children;
        for (x = 0; x < cells.length; x++) {
            if (cells[x].classList) {
                hasClass = cells[x].classList.contains('live');
            } else {
                hasClass = new RegExp('(^| )live( |$)', 'gi').test(cells[x].className);
            }
            if (hasClass) {
                result.push({ x: x, y: y });
                hasClass = false;
            }
        }
    }

    return result;
};
