import { Canvas2dRenderer } from 'hyway/web'
import { Circle } from 'hyway/core';

const element = document.querySelector('#canvas');
const player = new Circle([200, 200], 40, { fillStyle: 'red' });
const graphics = [player]


const destination = {
    x: 200,
    y: 200,
}

element.addEventListener('click', (event) => {
    event.preventDefault();
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    destination.x = x;
    destination.y = y;
    console.log(destination)
});

let initSpeed = 0.4;
let speed = initSpeed;
let maxSpeed = 2;
let acceleration = 1.05;

function step() {
    if (destination.x !== player.x || destination.y !== player.y) {
        // Calculate the distance to the destination
        const dx = destination.x - player.x;
        const dy = destination.y - player.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize the direction vector
        if (distance > 0) {
            const directionX = dx / distance;
            const directionY = dy / distance;

            // Move the player towards the destination
            player.x += directionX * speed;
            player.y += directionY * speed;

            // Increase speed until maxSpeed is reached
            if (speed < maxSpeed) {
                speed *= acceleration;
            }
        }
        if (Math.abs(dx) > 0 && Math.abs(dx) < 1) {
            player.x = destination.x;
        }
        if (Math.abs(dy) > 0 && Math.abs(dy) < 1) {
            player.y = destination.y;
        }
    } else {
        // Reset speed when reaching the destination
        speed = initSpeed;
    }


    // Clear the canvas
    // renderer.draw();

    // requestAnimationFrame(step);
}
// step();

new Canvas2dRenderer({ element, graphics, animate: true, step });