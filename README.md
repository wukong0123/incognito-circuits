# incognito-circuits

A collection of zero-knowledge circuits.

## Sudoku Verification Circuit

This circuit verifies that a given 9x9 grid is a valid Sudoku solution.

### Circuit Description

The `Sudoku` template takes a 9x9 grid of numbers (1-9) as input and checks:
- Each row contains each digit from 1 to 9 exactly once
- Each column contains each digit from 1 to 9 exactly once
- Each 3x3 subgrid contains each digit from 1 to 9 exactly once

### Files

- `circuits/sudoku.circom`: The main Sudoku verification circuit
- `test/input.json`: Valid Sudoku test input
- `test/invalid.json`: Invalid Sudoku test input (contains duplicates)
- `test/test.js`: Test script using snarkjs
- `package.json`: Project configuration with compilation and test scripts

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Install Circom (if not already installed):
   - Via npm: `npm install -g circom`
   - Or follow installation instructions at https://docs.circom.io/

### Usage

1. Compile the circuit:
   ```
   npm run compile:sudoku
   ```

2. Run tests:
   ```
   npm test
   ```

The test will verify that valid Sudoku inputs are accepted and invalid ones are rejected.