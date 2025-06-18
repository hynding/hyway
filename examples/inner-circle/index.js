import { Canvas2dRenderer } from 'hyway/web'
import { Circle } from 'hyway/core';

const canvasElement = document.querySelector('#canvas');

const bounds = new Circle(
  [canvasElement.width / 2, canvasElement.height / 2], 
  canvasElement.width / 2, 
  { strokeStyle: 'black' }
);
const player = new Circle({ x: 200, y: 200 }, 50, { fillStyle: 'red' });
const spot = new Circle({ x: 50, y: 50 }, 5, { fillStyle: 'blue' });
const graphics = [bounds, player, spot];

let spotCollision = false;
let initSpeed = 0.4;
let speed = initSpeed;
let maxSpeed = 2;
let acceleration = 1.05;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveUp = true;
            break;
        case 'ArrowDown':
            moveDown = true;
            break;
        case 'ArrowLeft':
            moveLeft = true;
            break;
        case 'ArrowRight':
            moveRight = true;
            break;
    }
});
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveUp = false;
            break;
        case 'ArrowDown':
            moveDown = false;
            break;
        case 'ArrowLeft':
            moveLeft = false;
            break;
        case 'ArrowRight':
            moveRight = false;
            break;
    }
});

function updateSpotInBounds() {
    const threshold = player.radius * 2;
    // skew the random number to be more likely to be toward the edge
    let randomR = Math.pow(Math.random(), 0.5) * (bounds.radius - spot.radius);
    let randomAngle = Math.random() * Math.PI * 2;
    let randomX = bounds.x + randomR * Math.cos(randomAngle);
    let randomY = bounds.y + randomR * Math.sin(randomAngle);
    const dx = randomX - player.x;
    const dy = randomY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // ideally this should not be a recursive function
    // it should be provided a list of geometries to check against
    // and a minimum threshold for each or all geometries
    // to ensure the point is not inside the threshold proximity
    // The above will be trickier to implement 
    // as it should be processed during the random calculation of radius and angle
    // The random radius could first ensure their is available space 
    // within the circumference while being mindful of the threshold
    // This would necessitate calculating the collective collision + threshold objects
    // to produce a range of angles and radiis to avoid

    // Check if the distance is less than the sum of the radii
    if (distance < player.radius + spot.radius + threshold) {
        // If it is, generate new coordinates
        return updateSpotInBounds();
    }
    spot.x = randomX;
    spot.y = randomY;
}


function step() {

    if (moveUp || moveDown || moveLeft || moveRight) {
        speed = Math.min(speed * acceleration, maxSpeed);
    } else {
        speed = initSpeed;
    }
    if (moveUp) {
        player.y -= speed;
    }
    if (moveDown) {
        player.y += speed;
    }
    if (moveLeft) {
        player.x -= speed;
    }
    if (moveRight) {
        player.x += speed;
    }

    const dx2 = player.x - bounds.x;
    const dy2 = player.y - bounds.y;
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    if (distance2 > bounds.radius - player.radius) {
        // Move the player back to the edge of the bounds arc
        const angle = Math.atan2(dy2, dx2);
        player.x = bounds.x + (bounds.radius - player.radius) * Math.cos(angle);
        player.y = bounds.y + (bounds.radius - player.radius) * Math.sin(angle);
    }

    // Check for collision with the spot
    const dx = player.x - spot.x;
    const dy = player.y - spot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player.radius + spot.radius) {
        spotCollision = true;
    } else {
        spotCollision = false;
    }

    if (spotCollision) {
        // Draw the spot
        updateSpotInBounds();
    }
}
updateSpotInBounds();

new Canvas2dRenderer({ element: canvasElement, graphics, stretchToFit: false, animate: true, step });