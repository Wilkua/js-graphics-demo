(function () {
    var LogLevels = Object.freeze({
        'FATAL': 0,
        0: 'FATAL',
        'ERROR': 1,
        1: 'ERROR',
        'WARN': 2,
        2: 'WARN',
        'INFO': 3,
        3: 'INFO',
        'VERBOSE': 4,
        4: 'VERBOSE',
        'SILLY': 5,
        5: 'SILLY'
    });
    function debugInfoSetup (levelCap) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            var level = args.shift();
            if (level <= levelCap) {
                var levelName = LogLevels[level];
                if (console.hasOwnProperty(levelName.toLowerCase())) {
                    console[levelName.toLowerCase()].apply(console, args);
                } else {
                    args.unshift(levelName);
                    console.info.apply(console, args);
                }
            }
        }
    }
    var debugPrint = debugInfoSetup(LogLevels.INFO);

    debugPrint(LogLevels.INFO, 'Enter Game');

    var canvas = document.querySelector('#game');
    var ctx = canvas.getContext('2d');

    var entities = [];
    var startTm = 0;
    var frame = 0;
    var fps = '0';
    function drawLoop (frameTm) {
        debugPrint(LogLevels.SILLY, 'Enter Game::drawLoop');

        if (frameTm - startTm >= 1000) {
            fps = '' + frame;
            startTm = frameTm;
            frame = 0;
        }
        ++frame;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        entities.forEach(function (entity) {
            ctx.beginPath();
            ctx.rect(
                entity.x,
                entity.y,
                entity.w,
                entity.h
            );
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.closePath();
        });

        // Draw overlay stuff
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'black';
        var metrics = ctx.measureText(fps);
        ctx.fillText(fps, canvas.width - metrics.width - 2, canvas.height - 2);

        requestAnimationFrame(drawLoop);
        debugPrint(LogLevels.SILLY, 'Leave Game::drawLoop');
    }
    requestAnimationFrame(drawLoop);

    var box = { x: 20, y: 10, w: 30, h: 30 }
    var dx = 2;
    var dy = 2;
    function updateBox () {
        box.x += dx;
        box.y += dy;
        if (
            box.x + box.w >= canvas.width
            || box.x <= 0
        ) {
            dx = -dx;
        }
        if (
            box.y + box.h >= canvas.height
            || box.y <= 0
        ) {
            dy = -dy;
        }
    }
    setInterval(updateBox, 10);
    entities.push(box);
})();

