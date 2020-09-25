const moduleAssign = (moduleExports, ...objects) => Object.assign.apply([moduleExports || {}, ...objects])

moduleAssign(exports, {
  moduleAssign
})