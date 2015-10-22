/*global window: false */
/*global document: false */
/*global Patterns: false */
/*global Board: false */
/*jslint plusplus: true */
function populatePatterns(el) {
    'use strict';

    var optgroup,
        option,
        group,
        pattern;

    for (group in Patterns) {
        if (Patterns.hasOwnProperty(group)) {
            optgroup = document.createElement('optgroup');
            optgroup.label = group;

            for (pattern in Patterns[group]) {
                if (Patterns[group].hasOwnProperty(pattern)) {
                    option = document.createElement('option');
                    option.value = group + '.' + pattern;
                    option.innerText = pattern;
                    optgroup.appendChild(option);
                }
            }
            el.appendChild(optgroup);
        }
    }
}

function toggleCellStatus(el) {
    'use strict';

    if (el.classList) {
        if (el.classList.contains('live')) {
            el.classList.remove('live');
            el.classList.add('dead');
        } else {
            el.classList.remove('dead');
            el.classList.add('live');
        }
    } else {
        if (new RegExp('(^| )live( |$)', 'gi').test(el.className)) {
            el.className.replace(new RegExp('(^|\\b)' + String.prototype.split.call('live', ' ').join('|') + '(\\b|$)', 'gi'), ' ');
            el.className += ' dead';
        } else {
            el.className.replace(new RegExp('(^|\\b)' + String.prototype.split.call('dead', ' ').join('|') + '(\\b|$)', 'gi'), ' ');
            el.className += ' live';
        }
    }
}

function addClickEventToCells(isRunning) {
    'use strict';

    var cells = document.getElementsByClassName('cell'),
        handler,
        i;

    handler = function () {
        if (!isRunning) {
            toggleCellStatus(this);
        }
    };

    for (i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', handler);
    }
}

function start(board, interval) {
    'use strict';
    return setInterval(function () {
        board.evolve();
        board.render();
    }, interval);
}

function reset(board, timer, isRunning) {
    'use strict';
    clearInterval(timer);
    board.reset();
    board.render();
    addClickEventToCells(isRunning);
}

window.onload = function () {
    'use strict';

    var btnStart = document.getElementById('start'),
        btnReset = document.getElementById('reset'),
        inputInterval = document.getElementById('interval'),
        selPattern = document.getElementById('pattern'),
        timer = null,
        isRunning = false,
        board = new Board(40);

    board.render();

    populatePatterns(selPattern);
    addClickEventToCells(isRunning);

    selPattern.addEventListener('change', function () {
        if (this.value === 'CUSTOM') {
            btnStart.firstChild.data = 'Start';
            isRunning = false;
            reset(board, timer, isRunning);
        } else {
            var data = Patterns[this.value];
            board.reset();
            board.initialize(data);
        }
        return false;
    });

    btnReset.addEventListener('click', function () {
        isRunning = false;
        reset(board, timer, isRunning);

        selPattern.value = 'CUSTOM';
        inputInterval.value = '';
        btnStart.firstChild.data = 'Start';
    });

    btnStart.addEventListener('click', function () {
        var interval = inputInterval.value !== '' ? inputInterval.value : 100;

        if (selPattern.value === 'CUSTOM') {
            board.initialize(board.getCoordinates());
        }

        if (this.firstChild.data === 'Start') {
            isRunning = true;
            timer = start(board, interval);
            this.firstChild.data = 'Pause';
        } else {
            isRunning = false;
            addClickEventToCells(isRunning);
            clearInterval(timer);
            this.firstChild.data = 'Start';
        }
    });
};
