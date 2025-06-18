const canvasElement = document.querySelector('#canvas');
const canvas = canvasElement.getContext('2d');

let bounds = {
    x: canvasElement.width / 2,
    y: canvasElement.height / 2,
    r: canvasElement.width / 2
}

let spot = {
    x: 50,
    y: 50,
    r: 5
};
let player = {
    x: 200,
    y: 200,
    r: 50
};

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

function updateSpotSquare() {
    // Generate random coordinates for the spot that does not overlap with the player
    let randomX = Math.random() * (canvasElement.width - spot.r * 2) + spot.r;
    let randomY = Math.random() * (canvasElement.height - spot.r * 2) + spot.r;
    const dx = randomX - player.x;
    const dy = randomY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Check if the distance is less than the sum of the radii
    if (distance < player.r + spot.r) {
        // If it is, generate new coordinates
        return updateSpotSquare();
    }
    spotCollision = false;
    player.r -= 1;
    spot.x = randomX;
    spot.y = randomY;
}

function updateSpotInBounds() {
    const threshold = player.r * 2;
    // skew the random number to be more likely to be toward the edge
    let randomR = Math.pow(Math.random(), 0.5) * (bounds.r - spot.r);
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
    if (distance < player.r + spot.r + threshold) {
        // If it is, generate new coordinates
        return updateSpotInBounds();
    }
    spot.x = randomX;
    spot.y = randomY;
}


function step() {
    // Clear the canvas
    canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);

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

    // Check for collision with the bounds arc
    // const dx2 = player.x - bounds.x;
    // const dy2 = player.y - bounds.y;
    // const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    // if (distance2 > player.r + bounds.r) {
    //     // Move the player back to the edge of the bounds arc
    //     const angle = Math.atan2(dy2, dx2);
    //     player.x = bounds.x + (bounds.r + player.r) * Math.cos(angle);
    //     player.y = bounds.y + (bounds.r + player.r) * Math.sin(angle);
    // }

    const dx2 = player.x - bounds.x;
    const dy2 = player.y - bounds.y;
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    if (distance2 > bounds.r - player.r) {
        // Move the player back to the edge of the bounds arc
        const angle = Math.atan2(dy2, dx2);
        player.x = bounds.x + (bounds.r - player.r) * Math.cos(angle);
        player.y = bounds.y + (bounds.r - player.r) * Math.sin(angle);
    }
    

    // if (player.x + player.r > canvasElement.width) {
    //     player.x = canvasElement.width - player.r;
    // }
    // if (player.x - player.r < 0) {
    //     player.x = player.r;
    // }
    // if (player.y + player.r > canvasElement.height) {
    //     player.y = canvasElement.height - player.r;
    // }
    // if (player.y - player.r < 0) {
    //     player.y = player.r;
    // }

    // Check for collision with the spot
    const dx = player.x - spot.x;
    const dy = player.y - spot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < player.r + spot.r) {
        spotCollision = true;
    } else {
        spotCollision = false;
    }
    // Redraw the rectangle
    // canvas.fillStyle = 'blue';
    // canvas.fillRect(50, 50, 100, 100);
    // draw bounds circle stroke
    canvas.strokeStyle = 'blue';
    canvas.lineWidth = 2;
    canvas.beginPath();
    canvas.arc(bounds.x, bounds.y, bounds.r, 0, Math.PI * 2);
    canvas.stroke();
    // canvas.lineWidth = 2;

    // canvas.beginPath();
    // canvas.arc(bounds.x, bounds.y, bounds.r, 0, Math.PI * 2);
    // canvas.stoke();

    if (!spotCollision) {
        // Draw the spot
        canvas.fillStyle = 'black';
        canvas.beginPath();
        canvas.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
        canvas.fill();
    } else {
        updateSpotInBounds();
    }

    // Redraw the circle
    canvas.fillStyle = 'red';
    canvas.beginPath();
    canvas.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    canvas.fill();

    // Redraw the text
    // canvas.fillStyle = 'black';
    // canvas.font = '20px Arial';
    // canvas.fillText('Hello World', 150, 350);

    requestAnimationFrame(step);
}
updateSpotInBounds();
step();