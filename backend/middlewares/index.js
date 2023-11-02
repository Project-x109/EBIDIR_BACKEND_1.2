/* bring in the brain.js dependency
 */
const brain = require("brain.js");
/* Import the data file
 */
const data = require("./score.json");
const fs = require("fs");

/**
 * Create the  neural network
 */
const network = new brain.recurrent.LSTM();

/**
 * Training the model and setting the number
 * of iteration to make during the trainings
 */

const trainingData = data.map((item) => ({
  input: item.credit_score,
  output: item.label,
}));

network.train(trainingData, {
  log: (error) => console.log(error),
  iterations: 200,
});

/* Supply the input to classify
 */
// Save network state to JSON file.
const networkState = network.toJSON();
fs.writeFileSync("network_state.json", JSON.stringify(networkState), "utf-8");
