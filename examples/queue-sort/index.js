import { QueueSortSamples } from "./samples.js";
const TOTAL_OPTIONS = 20;
const STARTING_CHAR_CODE = 'A'.charCodeAt(0);
let QUEUE_SIZE = parseInt(document.querySelector('#queue-size').value, 10)
let QUEUES = [];
let QUEUE_SELECTED = -1;
let SAVED_STEPS = [];
const TEST_QUEUES = [
  [
    ['A', 'A', 'B', 'A'],
    ['B', 'B', 'A', 'B'],
    ['C', 'C', 'D', 'D'],
    ['C', 'D', 'C', 'D'],
    [],
    []
  ],
  [
    ['D', 'C', 'B', 'A'],
    ['F', 'G', 'F', 'E'],
    ['A', 'H', 'F', 'E'],
    ['J', 'D', 'I', 'I'],
    ['H', 'D', 'D', 'E'],
    ['G', 'B', 'K', 'K'],
    ['L', 'L', 'J', 'K'],
    ['H', 'B', 'C', 'G'],
    ['H', 'F', 'C', 'A'],
    ['J', 'E', 'I', 'I'],
    ['B', 'G', 'A', 'K'],
    ['C', 'L', 'J', 'L'],
    [],
    [],
  ],
]
QUEUES = JSON.parse(JSON.stringify(TEST_QUEUES[1])); // Uncomment to use test queues



init();

function init() {
  setup();
}

function setup() {
  setupOptions();

  document.querySelector('#reset').addEventListener('click', () => {
    reset();
  });
  document.querySelector('#solve').addEventListener('click', () => {
    solve();
    buildQueues();
  });
  document.querySelector('#step-through-solution').addEventListener('click', () => {
    stepThroughSolution();
  });
  document.querySelector('#possible').addEventListener('click', () => {
    const moves = getPossibleMoves();
    const html = moves.map((move) => {
      return `<li>${move.source} => ${move.destination}</li>`;
    })
    document.querySelector('#possible-moves').innerHTML = '<ul>' + html.join('') + '</ul>';
  });
  document.querySelector('.add-container').addEventListener('click', () => {
    addContainer();
  });
  document.querySelector('#queue-size').addEventListener('change', (event) => {
    QUEUE_SIZE = parseInt(event.target.value, 10);
    reset();
  });

  buildQueues();
}

function reset() {
  QUEUES = JSON.parse(JSON.stringify(TEST_QUEUES[1]));
  QUEUE_SELECTED = -1;
  buildQueues();
}

function solve() {
  console.log('Solving...');
  // Solve the queue so all items container the same value

  // First, get all the unique values from the queues
  const uniqueValues = QUEUES.flat().filter((value, index, self) => {
    return self.indexOf(value) === index;
  })

  let topPointer = 0;
  const steps = [];

  let testCount = 0;

  function recurseMoves(pointer = 0, moves = getPossibleMoves()) {
    // Check if all queues are complete
    if (areQueuesComplete()) {
      console.log('All queues are complete', QUEUES);
      return;
    }
    if (pointer >= moves.length) {
      if (steps.length === 0) {
        console.warn('No more moves available, but not all queues are complete');
        return;
      }
      const { pointer: lastPointer, ...lastStep } = steps.pop();
      revertStep(lastStep);
      console.log('Reverting last step');
      return recurseMoves(lastPointer + 1);
    }
    const move = moves[pointer];
    const sourceQueue = QUEUES[move.source];
    const destinationQueue = QUEUES[move.destination];
    
    // Check if the move is valid (don't move if destination is empty and source is all items)
    if (sourceQueue.length < move.itemsToMove.length || 
        destinationQueue.length === 0 && move.itemsToMove.length === sourceQueue.length ||
        destinationQueue.length + move.itemsToMove.length > QUEUE_SIZE ||
        (destinationQueue.length && destinationQueue[0] !== move.itemsToMove[0])) {
        console.log('moving to next')
      return recurseMoves(pointer + 1, moves);
    }

    // Perform the move
    const sourceSize = sourceQueue.length;
    const destinationSize = destinationQueue.length;
    sourceQueue.splice(0, move.itemsToMove.length);
    destinationQueue.splice(0, 0, ...move.itemsToMove);
    steps.push({ 
      source: move.source, 
      destination: move.destination, 
      items: move.itemsToMove,
      pointer,
      sourceSize,
      destinationSize
    });
    console.log('Performing next move', steps.length)
    testCount++;
    if (testCount > 200) {
      console.warn('Too many steps, stopping recursion');
      return;
    }
    console.log({ source: move.source, destination: move.destination, items: [...move.itemsToMove], pointer })
    return recurseMoves();
  }

  recurseMoves();
  // console.log('Steps:', steps);
  const optimizedSteps = optimizeSteps(steps);
  // console.log('Optimized Steps:', optimizedSteps);
  // buildQueues();

  return steps;
}

function revertStep({ source, destination, items }) {
  const sourceQueue = QUEUES[source];
  const destinationQueue = QUEUES[destination];
  if (!sourceQueue || !destinationQueue) {
    console.error('Invalid source or destination queue');
    return;
  }
  // Remove items from destination queue and add them back to source queue
  destinationQueue.splice(0, items.length);
  sourceQueue.splice(0, 0, ...items);
}

function optimizeSteps(steps) {
  const optimizedSteps = [...steps]
  // Steps where source to destination then back to source when source is not utilized in between can be removed
  const emptyStepMoves = [];
  optimizedSteps.forEach((step, index) => {
    // If moving all, make sure it's not a needless back and forth
    if (step.sourceSize === step.items.length) {
      for (let i = index + 1; i < optimizedSteps.length; i++) {
        const currentStep = optimizedSteps[i];
        if (currentStep.destination !== step.source) {
          continue;
        } else {
          if (!currentStep.destinationSize) {
            // If the destination is empty, we can remove this step
            console.log('detected empty step move', step, currentStep);
            emptyStepMoves.push([index, i]);
            break;
          }
        }
      }
    }
  })

  console.log('Empty step moves detected:', emptyStepMoves);

  // if (emptyStepMoves.length) {
  //   emptyStepMoves.forEach(([sourceIndex, destinationIndex]) => {
  //     source = steps[sourceIndex];
  //     destination = optimizedSteps[destinationIndex];
  //     // get the items from the destination, minus the items moved from the source and move them back to the source
  //     destination.items.splice(0, source.items.length);
  //     optimizedSteps.splice(sourceIndex, 1);
  //   });
  //   return optimizeSteps(optimizedSteps);
  // }
  return optimizedSteps;
}

function stepThroughSolution() {
  SAVED_STEPS = solve();
  reset();
  SAVED_STEPS.forEach((step, index) => {
    setTimeout(() => {
      const sourceQueue = QUEUES[step.source];
      const destinationQueue = QUEUES[step.destination];
      sourceQueue.splice(0, step.items.length);
      destinationQueue.splice(0, 0, ...step.items);
      buildQueues();
      console.log(`Step ${index + 1}:`, step);
    }, index * 1000);
  })
}

function showSolution() {
  const solutionContainer = document.querySelector('#solution');
  solutionContainer.innerHTML = '';
}

function getPossibleMoves() {
  const moves = [];
  for (let i = 0; i < QUEUES.length; i++) {
    if (isQueueComplete(i)) {
      continue; // Skip complete queues
    }
    const sourceQueue = QUEUES[i];
    if (!sourceQueue.length) {
      continue; // Skip empty queues
    }
    const itemsToMove = getTopAdjacentItems(sourceQueue);
    for (let j = 0; j < QUEUES.length; j++) {
      if (i === j || isQueueComplete(j)) {
        continue; // Skip same queue or complete queues
      }
      const destinationQueue = QUEUES[j];
      if (destinationQueue.length + itemsToMove.length > QUEUE_SIZE) {
        continue; // Skip if destination queue is too full
      }
      if (destinationQueue.length && destinationQueue[0] !== itemsToMove[0]) {
        continue; // Skip if destination queue does not match the first item of the source queue
      }
      moves.push({ source: i, destination: j, itemsToMove });
    }
  }
  // console.log('Possible moves:', moves);
  return moves;
}

function areQueuesComplete() {
  return QUEUES.every((queue) => {
    if (!queue.length) {
      return true;
    }
    return isQueueComplete(QUEUES.indexOf(queue));
  });
}

function selectSourceQueue(index) {
  if (isQueueComplete(index) || index < 0) {
    return;
  }
  if (!QUEUES[index].length) {
    return;
  }
  // deselect queue if current
  if (QUEUE_SELECTED === index) {
    QUEUE_SELECTED = -1;
  } else {
    QUEUE_SELECTED = index;
  }
  getContainers().forEach((container, i) => {
    if (i === QUEUE_SELECTED) {
      container.classList.add('selected');
      const itemsToMove = getTopAdjacentItems(QUEUES[i]);
      let value = null;
      container.querySelectorAll('.div').forEach((item, itemIndex) => {
        if (itemIndex < itemsToMove.length) {
          item.classList.add('highlight');
        }
        // if (itemIndex === 0) {
        //   value = item.textContent.trim();
        //   item.classList.add('highlight');
        // } else if (item.previousElementSibling.classList.contains('highlight')) {
        //   if (item.textContent.trim() === value) {
        //     item.classList.add('highlight');
        //   }
        // }
      });
    } else {
      container.classList.remove('selected');
      container.querySelectorAll('.div').forEach((item) => {
        item.classList.remove('highlight');
      });
    }
  });
}

function selectDestinationContainer(index) {
  if (isQueueComplete(index)) {
    return
  }
  // const container = document.querySelectorAll('.container')[index];
  // if (index < 0 || index >= containers.length) {
  //   console.error('Invalid container index');
  //   return;
  // }
  // containers.forEach((container, i) => {
  //   if (i === index) {
  //     container.classList.add('selected');
  //   } else {
  //     container.classList.remove('selected');
  //   }
  // });
}

function isQueueComplete(index) {
  const queue = QUEUES[index];
  if (!queue || queue.length < QUEUE_SIZE) {
    return false;
  }
  const uniqueItems = queue.filter((value, index, self) => {
    return self.indexOf(value) === index;
  })
  return uniqueItems.length === 1
}

function getContainers() {
  return document.querySelectorAll('.containers > .container');
}

function addContainer() {
  QUEUES.push([]);
  buildQueues();
}

function clearContainers() {
  const containers = document.querySelector('.containers');
  containers.innerHTML = '';
}


function setupOptions() {
  const optionsContainer = document.querySelector('.options');
  for (let i = 0; i < TOTAL_OPTIONS; i++) {
    const char = String.fromCharCode(STARTING_CHAR_CODE + i);
    const option = document.createElement('button');
    option.value = option.textContent = char;
    optionsContainer.appendChild(option);
    option.addEventListener('click', (event) => {
      const value = event.target.value;
      if (QUEUES.length === 0 || QUEUES[QUEUES.length - 1].length === QUEUE_SIZE) {
        QUEUES.push([value]);
      } else {
        QUEUES[QUEUES.length - 1].unshift(value);
      }
      buildQueues();
    })
  }
}

function buildQueues() {
  QUEUE_SELECTED = -1; // Reset selected queue
  const queuesContainer = document.querySelector('.containers');
  queuesContainer.innerHTML = '';
  QUEUES.forEach((queue, index) => {
    const container = document.createElement('div');
    container.className = 'container';
    container.style.height = `${QUEUE_SIZE * 20}px`;
    queue.forEach((item) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'div';
      itemDiv.textContent = item;
      container.appendChild(itemDiv);
    });
    queuesContainer.appendChild(container);
  });

  addContainerListeners();
}

function addContainerListeners() {
  const containers = getContainers();
  console.log('Adding container listeners', containers);
  containers.forEach((container, index) => {
    container.addEventListener('click', () => {
      // don't allow a move if it's complete
      if (isQueueComplete(index)) {
        console.warn('Queue is complete, cannot select');
        return;
      }
      if (QUEUE_SELECTED > -1 && QUEUE_SELECTED !== index) {
        moveItemsToQueue(index);
      } else {
        selectSourceQueue(index);
      }
    });
  });
}

function moveItemsToQueue(index) {
  if (QUEUE_SELECTED < 0) {
    console.error('No source queue selected');
    return;
  }
  const sourceQueue = QUEUES[QUEUE_SELECTED];
  if (!sourceQueue || sourceQueue.length === 0) {
    console.error('Source queue is empty');
    return;
  }
  const destinationQueue = QUEUES[index];
  const itemsToMove = getTopAdjacentItems(sourceQueue)
  if (destinationQueue.length + itemsToMove.length > QUEUE_SIZE) {
    console.error('Destination queue too full');
    return;
  }
  if (destinationQueue.length && destinationQueue[0] !== itemsToMove[0]) {
    console.error('Destination queue must match the first item of the source queue');
    return;
  }

  sourceQueue.splice(0, itemsToMove.length);
  destinationQueue.splice(0, 0, ...itemsToMove);
  
  buildQueues();
}

function getTopAdjacentItems(queue) {
  const adjacentItems = []
  if (!queue.length) {
    return adjacentItems;
  }
  adjacentItems.push(queue[0]);
  for (let i = 1; i < queue.length; i++) {
    if (queue[i] === queue[0]) {
      adjacentItems.push(queue[i]);
    } else {
      break;
    }
  }
  return adjacentItems;
}

function addItemToQueue(queueIndex, item) {
  const containers = document.querySelectorAll('.container');
  if (queueIndex < 0 || queueIndex >= containers.length) {
    console.error('Invalid queue index');
    return;
  }
  const container = containers[queueIndex];
  const newItem = document.createElement('div');
  newItem.className = 'div';
  newItem.textContent = item;
  container.appendChild(newItem);
}

function getQueues() {
  const containers = document.querySelectorAll('.container');
  const queues = [];
  containers.forEach((container) => {
    const queue = [];
    const items = container.querySelectorAll('.div');
    items.forEach((item) => {
      queue.push(item.textContent.trim());
    });
    queues.push(queue);
  });
  return queues;
}