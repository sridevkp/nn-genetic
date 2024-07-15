

export default class NN {
    constructor(ip, hidden, op, rate = 0.1) {
        this.ip = ip;
        this.hidden = hidden;
        this.op = op;
        this.B = [math.subtract(math.random([hidden, 1]), 0.5), math.subtract(math.random([op, 1]), 0.5)];
        this.W = [math.subtract(math.random([hidden, ip]), 0.5), math.subtract(math.random([op, hidden]), 0.5)];
        this.learning_rate = rate;
        this.accuracy = 0;
    }

    setW(weights) {
        this.W[0] = math.reshape(math.matrix(weights[0]), [this.hidden, this.ip]);
        this.W[1] = math.reshape(math.matrix(weights[1]), [this.op, this.hidden]);
    }

    setB(biasis) {
        this.B = biasis.map(b => math.matrix(b));
    }

    // static load(path) {
    //     try {
    //         const data = fs.readFileSync(path, 'utf8');
    //         const rows = data.trim().split('\n').map(row => row.split(',').map(val => parseFloat(val)));
    //         const [ip, hidden, op] = rows[0].map(i => parseInt(i));

    //         const nn = new NN(ip, hidden, op);
    //         nn.setW(rows.slice(1, 3));
    //         nn.setB(rows.slice(3, 5));
    //         return nn;
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    // save(path) {
    //     const W = this.W.map(w => math.flatten(w)._data);
    //     const B = this.B.map(b => math.flatten(b)._data);
    //     const data = [
    //         [this.ip, this.hidden, this.op],
    //         ...W,
    //         ...B
    //     ].map(row => row.join(',')).join('\n');

    //     fs.writeFileSync(path, data, 'utf8');
    // }

    updateParams(dW1, dB1, dW2, dB2) {
        this.W[0] = math.subtract(this.W[0], math.multiply(this.learning_rate, dW1));
        this.W[1] = math.subtract(this.W[1], math.multiply(this.learning_rate, dW2));
        this.B[0] = math.subtract(this.B[0], math.multiply(this.learning_rate, dB1));
        this.B[1] = math.subtract(this.B[1], math.multiply(this.learning_rate, dB2));
    }

    fdProp(A) {
        const Z1 = math.add(math.multiply(this.W[0], A), this.B[0]);
        const A1 = ReLU(Z1);
        const Z2 = math.add(math.multiply(this.W[1], A1), this.B[1]);
        const A2 = softmax(Z2);
        return [Z1, A1, Z2, A2];
    }

    bdProp(X, Z1, A1, Z2, A2, Y, m) {
        const dZ2 = math.subtract(A2, Y);
        const dW2 = math.divide(math.multiply(dZ2, math.transpose(A1)), m);
        const dB2 = math.reshape(math.divide(math.sum(Z2), m), [-1, 1]);
        const dZ1 = math.dotMultiply(math.multiply(math.transpose(this.W[1]), dZ2), derivReLU(Z1));
        const dW1 = math.divide(math.multiply(dZ1, math.transpose(X)), m);
        const dB1 = math.reshape(math.divide(math.sum(dZ1), m), [-1, 1]);
        return [dW1, dB1, dW2, dB2];
    }

    getAccuracy(X, Y) {
        const [result, index] = this.predict(X);
        return math.sum(math.equal(result, Y)) / Y.size;
    }

    train(X, Y, m = 1000) {
        const [Z1, A1, Z2, A2] = this.fdProp(X);
        const [dW1, dB1, dW2, dB2] = this.bdProp(X, Z1, A1, Z2, A2, Y, m);
        this.updateParams(dW1, dB1, dW2, dB2);
    }

    predict(ip) {
        const [Z1, A1, Z2, result] = this.fdProp(ip);
        return [result, math.argmax(result)];
    }
    static crossover(nn1, nn2) {
        const child = new NN(nn1.ip, nn1.hidden, nn1.op, nn1.learning_rate);

        for (let i = 0; i < child.W.length; i++) {
            const W1 = nn1.W[i].toArray();
            const W2 = nn2.W[i].toArray();
            const W_child = W1.map((w, idx) => (Math.random() < 0.5 ? w : W2[idx]));
            child.W[i] = math.reshape(W_child, nn1.W[i].size());
        }

        for (let i = 0; i < child.B.length; i++) {
            const B1 = nn1.B[i].toArray();
            const B2 = nn2.B[i].toArray();
            const B_child = B1.map((b, idx) => (Math.random() < 0.5 ? b : B2[idx]));
            child.B[i] = math.reshape(B_child, nn1.B[i].size());
        }

        return child;
    }
}

function softmax(x) {
    const expX = math.exp(x);
    return math.divide(expX, math.sum(expX));
}

function ReLU(x) {
    return math.max(0, x);
}

function derivReLU(x) {
    return math.map(x, val => (val > 0 ? 1 : 0));
}