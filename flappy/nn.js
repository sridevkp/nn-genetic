import Matrix from "./matrix.js";

export default class NeuralNet{
	constructor(input, hidden, output) {
		this.input = input;
		this.hidden = hidden;
		this.output = output;
		this.learningRate = 0.1;

		this.weights_ih = new Matrix(hidden, input);
		this.weights_ho = new Matrix(output, hidden);
		
		this.bias_h = new Matrix(hidden, 1);
		this.bias_o = new Matrix(output, 1);

		this.randomize()
	}

	randomize(){
		this.weights_ih.randomize();
		this.weights_ho.randomize();

		this.bias_h.randomize();
		this.bias_o.randomize();
	}

  	train( input, target ) {
		var input = Matrix.toMatrix(input);
		var hidden = Matrix.multiply(this.weights_ih, input);

		const sigmoid =  x =>  1 / (1 + Math.exp(-x))
		const derivSigmoid = x => x * (1 - x)

		hidden.add(this.bias_h);
		hidden.map( sigmoid );

		const output = Matrix.multiply(this.weights_ho, hidden);
		output.add(this.bias_o);
		output.map( sigmoid );


		const targetY = Matrix.toMatrix(target);

		var out_error = Matrix.subtract(targetY, output);

		var gradient = Matrix.map(output, derivSigmoid );

		gradient.multiply(out_error);
		gradient.multiply(this.learningRate);

		var hidden_t = hidden.transposed();
		var weight_deltas = Matrix.multiply(gradient, hidden_t);

		this.weights_ho.add(weight_deltas);
		this.bias_o.add(gradient);

		var weights_ho_t =  this.weights_ho.transposed();
		var hidden_error = Matrix.multiply( weights_ho_t, out_error );

		var hidden_gradient = Matrix.map( hidden, derivSigmoid );

		hidden_gradient.multiply(hidden_error);
		hidden_gradient.multiply(this.learningRate);

		var input_t = input.transposed();
		var weight_deltas = Matrix.multiply(hidden_gradient, input_t);

		this.weights_ih.add(weight_deltas);
		this.bias_h.add(hidden_gradient);
	}

  	predict(input) {
		const ninput = Matrix.toMatrix( input );
		let hidden = Matrix.multiply( this.weights_ih, ninput );

		hidden = Matrix.add( this.bias_h, hidden );
		hidden.map( x => 1 / (1 + Math.exp(-x)) );

		let out = Matrix.multiply( this.weights_ho, hidden );
		out = Matrix.add( out, this.bias_o);
		out.map( x  => 1 / (1 + Math.exp(-x)) );

		return out.toArray();
	}

  	mutate(rate) {
		const mutate = val => {
			if (Math.random() < rate) {
				let newVal = val + (Math.random() - 0.5) * 0.09;
				if (newVal > 1) {
					newVal = 1;
				} else if (newVal < -1) {
					newVal = -1;
				}
				return newVal;
			} else {
				return val;
			}
		};
		this.weights_ih.map( mutate );
		this.weights_ho.map( mutate );
		this.bias_h.map( mutate );
		this.bias_o.map( mutate );
	}

	static crossover(father, mother) {
		const child = new NeuralNet( this.input, this.hidden, this. output)
		child.weights_ih = Matrix.crossover(father.weights_ih, mother.weights_ih);

		child.weights_ho = Matrix.crossover(father.weights_ho, mother.weights_ho);

		child.bias_h = Matrix.crossover(father.bias_h, mother.bias_h);

		child.bias_o = Matrix.crossover(father.bias_o, mother.bias_o);
		return child
	};
}
