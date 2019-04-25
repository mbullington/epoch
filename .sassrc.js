const path = require('path')

const CWD = process.cwd()

module.exports = {
  "includePaths": [
    path.resolve(CWD, 'node_modules'),
    // Fix for Inter UI fonts.
    path.resolve(CWD, 'node_modules', 'inter-ui'),
    path.resolve(CWD, 'styles')
  ]
}
