let graphics;
let points = [];
let scoreText;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#222222",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {}

function create() {
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff } });
    scoreText = this.add.text(20, 20, "Draw a circle!", { fontSize: "24px", fill: "#fff" });

    this.input.on('pointerdown', () => {
        points = [];
        graphics.clear();
        graphics.lineStyle(2, 0xffffff);
        graphics.beginPath();
    });

    this.input.on('pointermove', (pointer) => {
        if (pointer.isDown) {
            points.push({ x: pointer.x, y: pointer.y });
            graphics.lineTo(pointer.x, pointer.y);
            graphics.strokePath();
        }
    });

    this.input.on('pointerup', () => {
        if (points.length > 10) {
            let score = calculateCircleScore(points);
            scoreText.setText("Your circle score: " + score.toFixed(2) + "%");
        } else {
            scoreText.setText("Too few points, try again!");
        }
    });
}

function update() {}

function calculateCircleScore(points) {
    // Find center (average x & y)
    let sumX = 0, sumY = 0;
    points.forEach(p => { sumX += p.x; sumY += p.y; });
    let centerX = sumX / points.length;
    let centerY = sumY / points.length;

    // Find distances from center
    let distances = points.map(p => Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2));
    let avgRadius = distances.reduce((a, b) => a + b, 0) / distances.length;

    // Measure deviation
    let variance = distances.reduce((sum, d) => sum + Math.abs(d - avgRadius), 0) / distances.length;

    // Convert to score (smaller variance = better score)
    let maxPossibleVariance = avgRadius / 2;
    let accuracy = Math.max(0, 100 - (variance / maxPossibleVariance) * 100);

    return accuracy;
}
