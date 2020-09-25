// var results = ['a', 'b', 'c'];
// results.reduce(async (promise, snapshot) => {
//   await promise;
//   await new Promise(resolve => {
//     setTimeout(() => {
//       console.log(snapshot, Date.now());
//       resolve()
//     }, 3000 );
//   });
// }, Promise.resolve());


const waterfall = (promises, decorator = () => () => {}) => {
  const reducer = (current, promise) => current.then(decorator(promise));

  return promises.reduce(reducer, Promise.resolve());
};

module.exports = waterfall;
