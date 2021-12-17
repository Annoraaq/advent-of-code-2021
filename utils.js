const fs = require('fs');
const getInput = () => {
  return fs.readFileSync('/dev/stdin').toString().split('\n').filter(line => line !== '');
}

const getCharGridInput = () => {
  return getInput().map(rowStr => [...rowStr]);
}

const getIntGridInput = () => {
  return getInput().map(rowStr => [...rowStr].map(Number));
}

const getRawInput = () => {
  return fs.readFileSync('/dev/stdin').toString();
}

const getIntInput = () => {
  return getInput().map(line => Number(line));
}

class MinHeap {
  constructor(weightFn) {
    this.items = [];
    this.weightFn = weightFn;
  }
  size() { return this.items.length }
  isEmpty() { return this.size() <= 0 }
  swap(i, j) {
    const temp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = temp;
  }
  parentIndex(i) {
    return Math.floor((i + 1) / 2 - 1);
  }
  leftChildIndex(i) {
    return (i + 1) * 2 - 1;
  }
  rightChildIndex(i) {
    return (i + 1) * 2;
  }

  insert(item) {
    this.items.push(item);
    let currentIndex = this.size() - 1;
    while (this.parentIndex(currentIndex) >= 0 && this.weightFn(this.items[this.parentIndex(currentIndex)]) > this.weightFn(item)) {
      this.swap(currentIndex, this.parentIndex(currentIndex));
      currentIndex = this.parentIndex(currentIndex);
    }
  }
  extractMin() {
    const smallest = this.items[0];
    const last = this.items.pop();
    if (this.size() <= 0) {
      return smallest;
    }
    if (this.size() >= 1) {
      this.items[0] = last;
    }

    let currentIndex = 0;
    while (true) {
      const leftChildIndex = this.leftChildIndex(currentIndex);
      const rightChildIndex = this.rightChildIndex(currentIndex);
      const hasLeftChild = leftChildIndex < this.size();
      const hasRightChild = rightChildIndex < this.size();
      if (!hasLeftChild && !hasRightChild) break;
      if (!hasLeftChild) {
        this.swap(currentIndex, rightChildIndex);
        currentIndex = rightChildIndex;
      } else if (!hasRightChild) {
        this.swap(currentIndex, leftChildIndex);
        currentIndex = leftChildIndex;
      } else {
        if (this.weightFn(this.items[leftChildIndex]) >= this.weightFn(this.items[currentIndex])
          && this.weightFn(this.items[rightChildIndex]) >= this.weightFn(this.items[currentIndex])) {
          break;
        }
        if (this.weightFn(this.items[leftChildIndex]) < this.weightFn(this.items[rightChildIndex])) {
          this.swap(currentIndex, leftChildIndex);
          currentIndex = leftChildIndex;
        } else {
          this.swap(currentIndex, rightChildIndex);
          currentIndex = rightChildIndex;
        }
      }
    }

    return smallest;
  }
}

module.exports = {
  getInput,
  getRawInput,
  getIntInput,
  getCharGridInput,
  getIntGridInput,
  MinHeap
};
