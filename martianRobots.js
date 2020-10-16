const WORLD_DIRECTIONS = ['N', 'E', 'S', 'W']

const DEBUG_ROBOTS = true

class TheWorld {
  constructor(width, height) {
    this.width = width
    this.height = height

    // that's far from optimal way of doing scents for CPU
    // but quite optimal for developers...
    this.scents = {}

    console.log(`World size is: ${this.width}x${this.height}`)
  }

  isPositionInsideWorld(x, y) {
    return (x >= 0) && (x < this.width) && (y >= 0) && (y < this.height)
  }

  isScentAtPosition(x, y) {
    return !!this.scents[`${x}:${y}`]
  }

  putScentAtPosition(x, y) {
    this.scents[`${x}:${y}`] = true
  }
}

class TheRobot {
  constructor(world, x, y, direction) {
    this.world = world
    this.x = x
    this.y = y

    // directionIdx is
    this.directionIdx = WORLD_DIRECTIONS.indexOf(direction)

    // if the robot falls of the world it's no longer alive
    this.alive = true

    // debug this robot ?
    this.debugMe = false
  }

  processOneOrder(order) {
    if (this.alive) {

      switch (order) {
        case 'R': {
          this.directionIdx = this.directionIdx + 1

          // we could go clever and do modulo here... but... naah
          if (this.directionIdx > 3) {
            this.directionIdx = 0
          }
          break
        }
        case 'L': {
          this.directionIdx = this.directionIdx - 1

          // we could go clever and do modulo here... but... naah
          if (this.directionIdx < 0) {
            this.directionIdx = 3
          }
          break
        }
        case 'F': {
          /* compute new "candidate position" */
          let newX = this.x
          let newY = this.y
          /* optimize it:
          we could use directionIdx directly as the mapping to string by WORLD_DIRECTIONS
          is just for developers convenience */
          switch (WORLD_DIRECTIONS[this.directionIdx]) {
            case 'N': {
              newY++
              break
            }
            case 'E': {
              newX++
              break
            }
            case 'S': {
              newY--
              break
            }
            case 'W': {
              newX--
              break
            }
          }

          if (this.debugMe) {
            console.log(`new pos ?`, newX, newY)
          }

          /* check if new position can be applied, or is the robot blocked from movement */
          let doApplyNewPosition = false
          if (this.world.isPositionInsideWorld(newX, newY)) {
            doApplyNewPosition = true
          } else {
            if (!this.world.isScentAtPosition(this.x, this.y)) {
              if (this.debugMe) {
                console.log(`robot is LOST now, adding scent at ${this.x}-${this.y}`)
              }
              this.world.putScentAtPosition(this.x, this.y)
              this.alive = false
              doApplyNewPosition = true
            } else {
              if (this.debugMe) {
                console.log(`scent detected, robot stays ${this.x}-${this.y} ignoring F order`)
              }
            }
          }

          /* apply new position */
          if (doApplyNewPosition) {
            this.x = newX
            this.y = newY
          }
        }
      }

      if (this.debugMe) {
        console.log(`robot did ${order} state is ${this.getCurrentState()}`)
      }
    } else {
      if (this.debugMe) {
        console.log(`robot is LOST, can't do orders... :(`)
      }
    }
  }

  getCurrentState() {
    let theState = `${this.x} ${this.y} ${WORLD_DIRECTIONS[this.directionIdx]}`
    if (!this.alive) {
      theState += ' LOST'
    }
    return theState
  }
}

const processRobotsWorld = (worldInput) => {
  let worldOutput = ''

  /* extract lines */
  worldInputLines = worldInput.split('\n')

  /* parse 1st line - the world size */
  const worldSizeRaw = worldInputLines[0].split(' ')
  const world = new TheWorld(parseInt(worldSizeRaw[0]) + 1, parseInt(worldSizeRaw[1]) + 1)

  /* parse all other lines as robot position and movement definitions */
  let currentLineIdx = 1 // as first line was used in previous step
  while (currentLineIdx < worldInputLines.length) {
    if (DEBUG_ROBOTS) {
      console.log('--- PROCESSING ROBOT')
    }

    /* extract position and movement lines */
    const robotPositionAsRawLine = worldInputLines[currentLineIdx]
    const robotOrdersAsRawLine = worldInputLines[currentLineIdx + 1]

    /* parse position */
    const robotPosition = robotPositionAsRawLine.split(' ')
    const robot = new TheRobot(world, robotPosition[0], robotPosition[1], robotPosition[2])

    if (DEBUG_ROBOTS) {
      //if (currentLineIdx == 3) robot.debugMe = true
      robot.debugMe = true
    }
    const robotOrders = robotOrdersAsRawLine.split('')
    robotOrders.forEach(anOrder => {
      robot.processOneOrder(anOrder)
    });

    worldOutput += robot.getCurrentState() + '\n'

    currentLineIdx += 2
  }

  return worldOutput
}

module.exports = {
  processRobotsWorld
}