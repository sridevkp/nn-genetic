export default class Matrix {
	constructor(rowsOrMatrix, cols) {
		if (rowsOrMatrix instanceof Matrix) {
			this.data = rowsOrMatrix.data.map(row => [...row]);
			this.rows = this.data.length;
			this.cols = this.data[0].length;
		} else {
			this.rows = rowsOrMatrix;
			this.cols = cols;
			this.data = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
		}
	}

	div(x) {
		this.data.forEach(row => row.forEach((_, j, arr) => arr[j] /= x));
	}

	multiply(x) {
		this.data.forEach(row => row.forEach((_, j, arr) => arr[j] *= x));
	}

	transpose() {
		const temp = this.data;
		[this.rows, this.cols] = [this.cols, this.rows];
		this.data = Array.from({ length: this.rows }, (_, i) => Array.from({ length: this.cols }, (_, j) => temp[j][i]));
		return this;
	}

	map( func ) {
		this.data.forEach((row, i) => row.forEach((val, j, arr) => arr[j] = func(val, i, j)));
		return this;
	}

	toArray() {
		return this.data.flat();
	}

	randomize() {
		this.data.forEach(row => row.forEach((_, j, arr) => arr[j] = Math.random() * 2 - 1));
	}

	static crossover(a, b) {
		if (a.rows !== b.rows || a.cols !== b.cols) {
			throw new Error("Matrix dimensions must match for crossover.");
		}
		const mid = Math.floor(a.rows / 2);
		const result = new Matrix(a.rows, a.cols);
		result.data = result.data.map((row, i) => row.map((_, j) => i < mid ? a.data[i][j] : b.data[i][j]));
		return result;
	}

	static subtract(m1, m2) {
		if (m1.rows !== m2.rows || m1.cols !== m2.cols) {
			throw new Error("Matrix dimensions must match for subtraction.");
		}
		return new Matrix(m1.rows, m1.cols).map((_, i, j) => m1.data[i][j] - m2.data[i][j]);
	}

	static add(m1, m2) {
		if (m1.rows !== m2.rows || m1.cols !== m2.cols) {
			throw new Error("Matrix dimensions must match for addition.");
		}
		return new Matrix(m1.rows, m1.cols).map((_, i, j) => m1.data[i][j] + m2.data[i][j]);
	}

	static multiply(m1, m2) {
		if (m1.cols !== m2.rows) {
			throw new Error("Matrix dimensions must align for multiplication.");
		}
		const result = new Matrix(m1.rows, m2.cols);
		result.data = result.data.map((row, i) => row.map((_, j) => {
			return m1.data[i].reduce((sum, _, k) => sum + m1.data[i][k] * m2.data[k][j], 0);
		}));
		return result;
	}
	static toMatrix( arr ) {
		const m = new Matrix(arr.length, 1);
		for (let i = 0; i < arr.length; i++) {
		  m.data[i][0] = arr[i];
		}
		return m;
	  }
}
