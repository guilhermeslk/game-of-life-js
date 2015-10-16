function populatePatterns( el ) {
    var optgroup = null;
    var option = null;

    for ( group in Patterns ) {
        optgroup = document.createElement('optgroup');
        optgroup.label = group;

        for ( pattern in Patterns[group] ) {
            option = document.createElement('option');
            option.value = group + '.' + pattern;
            option.innerText = pattern;
            optgroup.appendChild(option);
        }
        el.appendChild(optgroup);
    }
}

function toggleCellStatus( el ) {
    if ( el.classList ) {
        if ( el.classList.contains('live') ) {
            el.classList.remove('live');
            el.classList.add('dead');
        } else {
            el.classList.remove('dead');
            el.classList.add('live');
        }
    } else {
        if ( new RegExp('(^| )live( |$)', 'gi').test(el.className) ) {
            el.className.replace(new RegExp('(^|\\b)' + 'live'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            el.className += ' dead';
        } else {
            el.className.replace(new RegExp('(^|\\b)' + 'dead'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            el.className += ' live';
        }
    }
}

function addClickEventToCells( isRunning ) {
    var cells = document.getElementsByClassName('cell');
    for( var i = 0; i < cells.length; i++ ) {
        cells[i].addEventListener('click', function(e) {
            if ( !isRunning ) {
                toggleCellStatus(this);
            }
        });
    }
}
function start( board, interval ) {
    return setInterval(function () {
        board.evolve();
        board.render();
    }, interval);
}

function reset( board, timer, isRunning ) {
    clearInterval(timer);
    board.reset();
    board.render();
    addClickEventToCells(isRunning);
}

window.onload = function() {
    var btnStart = document.getElementById('start');
    var btnReset = document.getElementById('reset');
    var inputInterval = document.getElementById('interval');
    var selPattern = document.getElementById('pattern');

    var timer = null;
    var isRunning = false;

    var board = new Board(40);
    board.render();

    populatePatterns(selPattern);
    addClickEventToCells(isRunning);

    selPattern.addEventListener('change', function(e) {
        if ( this.value == 'CUSTOM' ) {
            btnStart.firstChild.data = 'Start';
            isRunning = false;
            reset( board, timer, isRunning );
        } else {
            var data = eval('Patterns.' + this.value);
            board.reset();
            board.initialize( data );
        }
        return false;
    });

    btnReset.addEventListener('click', function( e ) {
        isRunning = false;
        reset(board, timer, isRunning);

        selPattern.value = 'CUSTOM';
        inputInterval.value = '';
        btnStart.firstChild.data = 'Start';
    });

    btnStart.addEventListener('click', function(e) {
        var interval = inputInterval.value != '' ? inputInterval.value : 100;

        if ( selPattern.value == 'CUSTOM' ) {
            board.initialize( board.getCoordinates() );
        }

        if ( this.firstChild.data === 'Start' ) {
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
}