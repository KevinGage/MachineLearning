class NeuralNetwork {
  constructor(a, b, c, d) {
    //If passing in weights from a previous model then use them to create a new model, used by copy
    //If passing in new nodes use them to create a new model
    if (a instanceof tf.Sequential){
      this.model = a;
      this.input_nodes = b;
      this.hidden_nodes = c;
      this.output_nodes = d;
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;
      this.model = this.createModel();
    }
  }

  createModel() {
    //Create a sequential tenser flow model
    const model = tf.sequential();

    //Create a hidden perceptron layer that takes in input nodes and squashes outputs to 0 or 1 using sigmoid
    const hidden = tf.layers.dense({
      units: this.hidden_nodes,
      inputShape: [this.input_nodes],
      activation: 'sigmoid'
    });
    //Add hidden layer to model
    model.add(hidden);

    //Create output later that squashes all values to a percentage that adds up to 1
    const output = tf.layers.dense({
      units: this.output_nodes,
      activation: 'softmax'
    });

    //Add output layer to model
    model.add(output);

    return model;
  }

  predict(inputs) {
    //for tf tensor garbage collection
    return tf.tidy(()=> {
      //Tensfor flow works with multi dimensional arrays called tensors
      //Convert the input javascript array to a tensor
      const xs = tf.tensor2d([inputs]);

      //Make prediction and store in output in ys tensor
      const ys = this.model.predict(xs);

      //Get data from ys tensor into javascript array called output
      const outputs = ys.dataSync();

      return outputs;
    });
  }

  //Used to return a copy of a neural network for next generation
  //Ideally this would combine two somehow but this will just return a copy
  copy() {
    //for ts tensor garbage collection
    return tf.tidy(() => {
      //Make new model
      const modelCopy = this.createModel();

      //Get network weights from current model
      const weights = this.model.getWeights();
      const weightCopies = [];

      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }

      //Add old weights to new model
      modelCopy.setWeights(weightCopies);

      //Return a new object with the old weights
      return new NeuralNetwork(modelCopy, 
        this.input_nodes, 
        this.hidden_nodes, 
        this.output_nodes
      );
    });
  }

  //Give a decimal rate, that often the weights for a modal will be mutated
  //The mutation in this case is a randomGuassian value which is a random number that is between -1 and 1 but usually close to 0.
  //So it just mutates sometimes by a little
  mutate(rate) {
    //tf.tidy does garbage collection for tensors
    tf.tidy(()=> {
      const weights = this.model.getWeights();
      const mutatedWeights = [];

      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();

        for (let j = 0; j < values.length; j++) {
          if (random(1) < rate) {
            let w = values[j];
            values[j] = w + randomGaussian();
          }
        }
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      this.model.setWeights(mutatedWeights);
    });
  }

  getWeights() {
    let weightValues = [];

    tf.tidy(() => {
      const weights = this.model.getWeights();

      for (let i = 0; i < weights.length; i++) {
        let values = weights[i].dataSync().slice();
        weightValues.push(values);
      }
    });
    return weightValues;
  }

  dispose() {
    this.model.dispose();
  }
}