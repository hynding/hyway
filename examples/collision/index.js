import { Circle, getRandomInteger } from 'hyway/core'
import { Canvas2dRenderer } from 'hyway/web'

const renderer = new Canvas2dRenderer({ selector: '#canvas', animate: true, step: step3 });
const sizeRange = [50, 50]
const speeds = []
const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
const shapes = generateShapes(renderer.canvas, 10);
const directions = getDirections(shapes);
console.log(directions)
const speed = 5;

renderer.addGraphics(shapes);

function step() {
  const collisions = [];
  const collisionCourses = [];
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    const direction = directions[i];

    const collidingIndex = collisions.indexOf(shape);
    const hasCollided = collidingIndex !== -1;
    if (hasCollided) {
      const collisionCourse = collisionCourses[collidingIndex];
      direction.x = collisionCourse.x * -1;
      direction.y = collisionCourse.y * -1;;
    }
    
    shape.x += direction.x * speed;
    shape.y += direction.y * speed;

    // Bounce off the walls
    if (shape.x - shape.radius < 0 || shape.x + shape.radius > renderer.canvas.width) {
      direction.x *= -1;
      shape.x += direction.x * speed;
    }
    if (shape.y - shape.radius < 0 || shape.y + shape.radius > renderer.canvas.height) {
      direction.y *= -1;
      shape.y += direction.y * speed;
    }

    const collidingCircle = getCircleColliding(shape, shapes);
    if (collidingCircle) {
      const collisionDirection = getCollisionCourse(shape, collidingCircle);
      collisions.push(collidingCircle)
      collisionCourses.push(getCollisionCourse(collidingCircle, shape))
      direction.x = collisionDirection.x * -1; // Reverse the x direction for collision response
      direction.y = collisionDirection.y * -1; // Reverse the y direction for collision response
      shape.x += direction.x * speed;
      shape.y += direction.y * speed;
    }
  }
}


function step2() {
  const previousPositions = [];
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    const direction = directions[i];
    
    previousPositions.push({ x: shape.x, y: shape.y });
    shape.x += direction.x * speed;
    shape.y += direction.y * speed;
  }

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    const direction = directions[i];
    const previousPosition = previousPositions[i];
    // Bounce off the walls
    if (shape.x - shape.radius < 0 || shape.x + shape.radius > renderer.canvas.width) {
      direction.x *= -1;
      shape.x = previousPosition.x + (direction.x * speed);
    }
    if (shape.y - shape.radius < 0 || shape.y + shape.radius > renderer.canvas.height) {
      direction.y *= -1;
      shape.y = previousPosition.y + (direction.y * speed);
    }

    const collidingCircles = getCirclesColliding(shape, shapes);
    if (collidingCircles.length) {
      collidingCircles.forEach(collidingCircle => {
        const collisionDirection = getCollisionCourse(shape, collidingCircle);
        direction.x = collisionDirection.x * -1; // Reverse the x direction for collision response
        direction.y = collisionDirection.y * -1; // Reverse the y direction for collision response
        // shape.x = previousPosition.x + (direction.x * speed);
        // shape.y = previousPosition.y + (direction.y * speed);
        shape.x += (direction.x * speed);
        shape.y += (direction.y * speed);

        const directionIndexB = shapes.indexOf(collidingCircle);
        const directionB = directions[directionIndexB];
        const previousPositionB = previousPositions[directionIndexB];
        const collisionDirectionB = getCollisionCourse(collidingCircle, shape);
        directionB.x = collisionDirectionB.x * -1; // Reverse the x direction for collision response
        directionB.y = collisionDirectionB.y * -1; // Reverse the y direction for collision response
        // collidingCircle.x = previousPositionB.x + (directionB.x * speed);
        // collidingCircle.y = previousPositionB.y + (directionB.y * speed);
        collidingCircle.x += (directionB.x * speed);
        collidingCircle.y += (directionB.y * speed);
      })
    }
  }
}

function step3() {
  const previousPositions = [];
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    const direction = directions[i];
    const speed = speeds[i];
    
    previousPositions.push({ x: shape.x, y: shape.y });
    shape.x += direction.x * speed;
    shape.y += direction.y * speed;
  }

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    const direction = directions[i];
    const previousPosition = previousPositions[i];
    const speed = speeds[i];
    // Bounce off the walls
    if (shape.x - shape.radius < 0 || shape.x + shape.radius > renderer.canvas.width) {
      direction.x *= -1;
      shape.x = previousPosition.x + (direction.x * speed);
    }
    if (shape.y - shape.radius < 0 || shape.y + shape.radius > renderer.canvas.height) {
      direction.y *= -1;
      shape.y = previousPosition.y + (direction.y * speed);
    }

    const collidingCircles = getCirclesColliding(shape, shapes);
    if (collidingCircles.length) {
      collidingCircles.forEach(collidingCircle => {
        const collisionDirection = getCollisionCourse(shape, collidingCircle);
        const directionIndexB = shapes.indexOf(collidingCircle);
        const speedB = speeds[directionIndexB];
        const speedA = speeds[i];
        speeds[i] = speedB;
        speeds[directionIndexB] = speedA;

        direction.x = collisionDirection.x * -1; // Reverse the x direction for collision response
        direction.y = collisionDirection.y * -1; // Reverse the y direction for collision response
        // shape.x = previousPosition.x + (direction.x * speed);
        // shape.y = previousPosition.y + (direction.y * speed);
        shape.x += (direction.x * speedB);
        shape.y += (direction.y * speedB);

        const directionB = directions[directionIndexB];
        const previousPositionB = previousPositions[directionIndexB];
        const collisionDirectionB = getCollisionCourse(collidingCircle, shape);
        directionB.x = collisionDirectionB.x * -1; // Reverse the x direction for collision response
        directionB.y = collisionDirectionB.y * -1; // Reverse the y direction for collision response
        // collidingCircle.x = previousPositionB.x + (directionB.x * speed);
        // collidingCircle.y = previousPositionB.y + (directionB.y * speed);
        collidingCircle.x += (directionB.x * speedA);
        collidingCircle.y += (directionB.y * speedA);
      })
    }
  }
}

function generateShapes(canvasElement, count = 10) {
  const shapes = [];
  const width = canvasElement.width;
  const height = canvasElement.height;
  console.log('colors', colors);

  for (let i = 0; i < count; i++) {
    const shape = generateCircle(width, height, shapes, colors[i % colors.length]);
    shapes.push(shape);
    speeds.push(getRandomInteger(5, 2));
  }
  
  return shapes;
}

function generateCircle(containerWidth, containerHeight, existingCircles, color) {
  const radius = getRandomInteger(...sizeRange);
  const x = getRandomInteger(containerWidth - radius, radius);
  const y = getRandomInteger(containerHeight - radius, radius);
  const circle = new Circle([x, y], radius, { fillStyle: color });
  if (!isCircleColliding(circle, existingCircles)) {
    // existingCircles.push(circle);
    return circle;
  } else {
    console.log('colliding, trying again');
    return generateCircle(containerWidth, containerHeight, existingCircles, color);
  }
}

function isCircleColliding(circle, circles) {
  for (let i = 0; i < circles.length; i++) {
    const otherCircle = circles[i];
    if (circle !== otherCircle && checkCollisions(circle, otherCircle)) {
      return true;
    }
  }
  return false;
}

function getCircleColliding(circle, circles) {
  for (let i = 0; i < circles.length; i++) {
    const otherCircle = circles[i];
    if (circle !== otherCircle && checkCollisions(circle, otherCircle)) {
      return otherCircle;
    }
  }
  return false;
}

function getCirclesColliding(circle, circles) {
  const collisions = [];
  const startIndex = circles.indexOf(circle) + 1;
  for (let i = startIndex; i < circles.length; i++) {
    const otherCircle = circles[i];
    if (circle !== otherCircle && checkCollisions(circle, otherCircle)) {
      collisions.push(otherCircle);
    }
  }
  return collisions;
}

function checkCollisions(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (circle1.radius + circle2.radius);
}

function getRandomDirection() {
  return Math.random() < 0.5 ? -1 : 1;
}

function getDirections(shapes) {
  console.log('shapes', shapes);
  return shapes.map(() => ({
    x: getRandomDirection(),
    y: getRandomDirection()
  }));
}

function getCollisionCourse(circle1, circle2) {
  const dx = circle2.x - circle1.x;
  const dy = circle2.y - circle1.y;
  const angle = Math.atan2(dy, dx);
  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
}