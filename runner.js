const fs = require('fs')
const MartianRobots = require('./martianRobots')

const processingResult = MartianRobots.processRobotsWorld(fs.readFileSync('testData/in1.txt').toString())
console.log('-----')
console.log(processingResult)
fs.writeFileSync('testData/out1.txt', processingResult)
