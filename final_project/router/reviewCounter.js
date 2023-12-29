let reviewIdCounter = 2;

function incrementCounter() {
  reviewIdCounter++;
}

function getCounter() {
  return reviewIdCounter;
}

module.exports.counter = reviewIdCounter;
module.exports.incrementCounter = incrementCounter;
module.exports.getCounter = getCounter;
