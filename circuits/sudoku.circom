pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";

template Sudoku() {
    signal input puzzle[9][9];

    component distinctRows[9];
    component distinctCols[9];
    component distinctBoxes[9];

    // Check rows
    for (var i = 0; i < 9; i++) {
        distinctRows[i] = Distinct9();
        for (var j = 0; j < 9; j++) {
            distinctRows[i].in[j] <== puzzle[i][j];
        }
    }

    // Check columns
    for (var j = 0; j < 9; j++) {
        distinctCols[j] = Distinct9();
        for (var i = 0; i < 9; i++) {
            distinctCols[j].in[i] <== puzzle[i][j];
        }
    }

    // Check 3x3 boxes
    for (var bx = 0; bx < 3; bx++) {
        for (var by = 0; by < 3; by++) {
            var idx = bx * 3 + by;
            distinctBoxes[idx] = Distinct9();
            var k = 0;
            for (var i = bx*3; i < bx*3+3; i++) {
                for (var j = by*3; j < by*3+3; j++) {
                    distinctBoxes[idx].in[k] <== puzzle[i][j];
                    k++;
                }
            }
        }
    }
}

template Distinct9() {
    signal input in[9];

    component isEqual[9][9];

    for (var k = 1; k <= 9; k++) {
        var count = 0;
        for (var i = 0; i < 9; i++) {
            isEqual[k-1][i] = IsEqual();
            isEqual[k-1][i].in[0] <== in[i];
            isEqual[k-1][i].in[1] <== k;
            count += isEqual[k-1][i].out;
        }
        count === 1;
    }
}