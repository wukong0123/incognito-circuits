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
- `circuits/main.circom`: Main component instantiation
- `test/input.json`: Valid Sudoku test input (original)
- `test/valid2.json`: Valid Sudoku test input (shifted pattern)
- `test/invalid.json`: Invalid Sudoku test input (row duplicate)
- `test/invalid_column.json`: Invalid Sudoku test input (column duplicate)
- `test/invalid_box.json`: Invalid Sudoku test input (3x3 box duplicate)
- `test/invalid_range.json`: Invalid Sudoku test input (number out of 1-9 range)
- `test/test.js`: Comprehensive test script using snarkjs
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

1. Set up the circuit for Groth16 proving:
   ```
   npm run setup
   ```
   This will compile the circuit and perform the trusted setup ceremony.

2. Run the end-to-end tests:
   ```
   npm test
   ```

### Manual Setup Steps

If you prefer to run the setup steps manually:

1. Compile the circuit:
   ```
   npm run compile:sudoku
   ```

2. Generate powers of tau:
   ```
   npm run setup:powersoftau
   ```

3. Set up Groth16:
   ```
   npm run setup:groth16
   ```

4. Run tests:
   ```
   npm test
   ```

The test will run multiple scenarios:
- Valid Sudoku inputs (should pass)
- Invalid inputs with duplicates in rows, columns, or 3x3 boxes (should fail)
- Invalid inputs with numbers outside 1-9 range (should fail)