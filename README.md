# How to

Run it by

```
node runner.js
```

# Structure

- `/testData/` contains input and output data - at the moment just one file, but potentially some intro to making automation around it
- `/martianRobots.js` conatins main functions for robot-world processing
- `/runner.js` is a calling scipt, that loads data from file and passes to `martianRobots` for processing, then handles the output by writing it to a file

## Idea
The core core is all in `/martianRobots.js` everything else is to feed it with data and test it.

Future evolution of this magnificient project would potentially add more test sample to `testData/`, with handling in `runner.js` and then adding **new wonderful features and fireworks** to `martianRobots.js`.
