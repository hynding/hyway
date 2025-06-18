import { QueueSortSamples } from "./samples.js";

export class QueueSort {
  constructor() {
    this.queueSize = 4; // Default queue size
    this.selectedIndex = -1; // No queue selected initially
    this.selectedItems = 0;
  }

  get settings() {
    return {
      queues: this.queues,
      queueSize: this.queueSize,
      selectedIndex: this.selectedIndex,
      selectedItems: this.selectedItems,
    }
  }

  start() {
    this.queues = QueueSortSamples()[1];
  }

  reset() {
    this.queues = QueueSortSamples()[1];
    this.selectedIndex = -1;
    this.selectedItems = 0;
  }

  clear() {
    this.queues = [[]];
    this.selectedIndex = -1;
    this.selectedItems = 0;
  }

  setQueueSize(size) {
    this.queueSize = size;
    this.reset();
  }

  addItemToQueue(item) {
    if (this.queues.length === 0 || this.queues[this.queues.length - 1].length === this.queueSize) {
      this.queues.push([item]);
    } else {
      this.queues[this.queues.length - 1].unshift(item);
    }
  }

  appendContainer() {
    this.queues.push([])
  }
  
  isQueueComplete(index) {
    const queue = this.queues[index];
    if (!queue || queue.length < this.queueSize) {
      return false;
    }
    const uniqueItems = queue.filter((value, index, self) => {
      return self.indexOf(value) === index;
    })
    return uniqueItems.length === 1
  }

  isSolved() {
    return this.queues.every((queue) => {
      if (!queue.length) {
        return true;
      }
      return this.isQueueComplete(this.queues.indexOf(queue));
    });
  }

  selectQueue(index) {
    // don't allow a move if it's complete
    if (this.isQueueComplete(index)) {
      console.warn('Queue is complete, cannot select');
      return;
    }
    if (this.selectedIndex > -1 && this.selectedIndex !== index) {
      this.moveItemsToQueue(index);
      return { action: 'move', source: this.selectedIndex, destination: index, selectedItems: this.selectedItems }
    } else {
      this.selectSourceQueue(index);
      return { action: 'select', source: this.selectedIndex, destination: index, selectedItems: this.selectedItems }
    }
  }

  moveItemsToQueue(index) {
    if (this.selectedIndex < 0) {
      console.error('No source queue selected');
      return;
    }
    const sourceQueue = this.queues[this.selectedIndex];
    if (!sourceQueue || sourceQueue.length === 0) {
      console.error('Source queue is empty');
      return;
    }
    const destinationQueue = this.queues[index];
    const itemsToMove = this.getTopAdjacentItems(this.selectedIndex)
    if (destinationQueue.length + itemsToMove.length > this.queueSize) {
      console.error('Destination queue too full');
      return;
    }
    if (destinationQueue.length && destinationQueue[0] !== itemsToMove[0]) {
      console.error('Destination queue must match the first item of the source queue');
      return;
    }

    sourceQueue.splice(0, itemsToMove.length);
    destinationQueue.splice(0, 0, ...itemsToMove);

    this.selectedIndex = -1;
  }

  getTopAdjacentItems(index) {
    const queue = this.queues[index];
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

  selectSourceQueue(index) {
    if (this.isQueueComplete(index) || index < 0) {
      return;
    }
    if (!this.queues[index].length) {
      return;
    }
    // deselect queue if current
    if (this.selectedIndex === index) {
      this.selectedIndex = -1;
      this.selectedItems = 0;
    } else {
      this.selectedIndex = index;
      this.selectedItems = this.getTopAdjacentItems(index).length;
    }
  }

  getPossibleMoves() {
    const moves = [];
    for (let i = 0; i < this.queues.length; i++) {
      if (this.isQueueComplete(i)) {
        continue; // Skip complete queues
      }
      const sourceQueue = this.queues[i];
      if (!sourceQueue.length) {
        continue; // Skip empty queues
      }
      const itemsToMove = this.getTopAdjacentItems(i);
      for (let j = 0; j < this.queues.length; j++) {
        if (i === j || this.isQueueComplete(j)) {
          continue; // Skip same queue or complete queues
        }
        const destinationQueue = this.queues[j];
        if (destinationQueue.length + itemsToMove.length > this.queueSize) {
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

  revertStep({ source, destination, items }) {
    const sourceQueue = this.queues[source];
    const destinationQueue = this.queues[destination];
    if (!sourceQueue || !destinationQueue) {
      console.error('Invalid source or destination queue');
      return;
    }
    // Remove items from destination queue and add them back to source queue
    destinationQueue.splice(0, items.length);
    sourceQueue.splice(0, 0, ...items);
  }

  getUniqueValues() {
    return this.queues.flat().filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  solve() {
    console.log('Solving...');

    const steps = [];

    let testCount = 0;
    const recurseMoves = (pointer = 0, moves = this.getPossibleMoves()) => {
      // Check if all queues are complete
      if (this.isSolved()) {
        console.log('All queues are complete');
        return;
      }
      if (pointer >= moves.length) {
        if (steps.length === 0) {
          console.warn('No more moves available, but not all queues are complete');
          return;
        }
        const { pointer: lastPointer, ...lastStep } = steps.pop();
        this.revertStep(lastStep);
        console.log('Reverting last step');
        return recurseMoves(lastPointer + 1);
      }
      const move = moves[pointer];
      const sourceQueue = this.queues[move.source];
      const destinationQueue = this.queues[move.destination];
      
      // Check if the move is valid (don't move if destination is empty and source is all items)
      if (sourceQueue.length < move.itemsToMove.length || 
          destinationQueue.length === 0 && move.itemsToMove.length === sourceQueue.length ||
          destinationQueue.length + move.itemsToMove.length > this.queueSize ||
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

    return steps;
  }
}