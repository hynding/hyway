import { QueueSort } from "./QueueSort.js";

const TOTAL_OPTIONS = 20;
const STARTING_CHAR_CODE = 'A'.charCodeAt(0);

let game;

function init() {
  game = new QueueSort();
  game.start();

  setupOptions();

  document.querySelector('#reset').addEventListener('click', () => {
    game.reset();
  });
  document.querySelector('#clear').addEventListener('click', () => {
    game.clear();
    render(game.settings)
  });
  document.querySelector('#solve').addEventListener('click', () => {
    game.solve();
    render(game.settings);
  });
  document.querySelector('#step-through-solution').addEventListener('click', () => {
    const steps = game.solve();
    game.reset();
    stepThroughSolution(steps);
  });
  // document.querySelector('#possible').addEventListener('click', () => {
  //   const moves = getPossibleMoves();
  //   const html = moves.map((move) => {
  //     return `<li>${move.source} => ${move.destination}</li>`;
  //   })
  //   document.querySelector('#possible-moves').innerHTML = '<ul>' + html.join('') + '</ul>';
  // });
  document.querySelector('.add-container').addEventListener('click', () => {
    game.appendContainer();
    render(game.settings);
  });
  document.querySelector('#queue-size').addEventListener('change', (event) => {
    game.setQueueSize(parseInt(event.target.value, 10));
    render(game.settings);
  });

  console.log('game.settings', game.settings); 
  render(game.settings);
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
      game.addItemToQueue(value);
      render(game.settings);
    })
  }
}

let isWaiting = false

function render(settings) {
  const queuesContainer = document.querySelector('.containers');
  const containers = queuesContainer.querySelectorAll('.container')
  queuesContainer.innerHTML = '';
  settings.queues.forEach((queue, index) => {
    const container = document.createElement('div');
    container.classList.add('container');
    container.style.height = `${settings.queueSize * 20}px`;
    if (settings.selectedIndex === index) {
      container.classList.add('selected');
    }
    container.addEventListener('click', (event) => {
      // TODO: setup animation classes
      const { action, source, destination } = game.selectQueue(index);
      if (action === 'move') {
        event.target.querySelectorAll('.highlight').forEach((item) => {
          item.classList.add('animateUp')
        })
      }
      if (action === 'select') {
        event.target.querySelectorAll('.highlight').forEach((item) => {
          item.classList.add('animateUp')
        })
      }

      render(game.settings);
    });
    queue.forEach((item, itemIndex) => {
      const itemDiv = document.createElement('div');
      if (settings.selectedIndex === index) {
        console.log('itemIndex < settings.selectedItems', itemIndex, settings.selectedItems)
      }
      if (settings.selectedIndex === index && itemIndex < settings.selectedItems) {
        itemDiv.classList.add('highlight');
      }
      itemDiv.textContent = item;
      container.appendChild(itemDiv);
    });
    queuesContainer.appendChild(container);
  });
}

function update(settings) {

}

function stepThroughSolution(steps) {
  steps.forEach((step, index) => {
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

init();