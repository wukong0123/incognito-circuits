const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function testSudoku() {
    console.log("Testing Sudoku circuit...");

    const buildDir = path.join(__dirname, "../build");
    const testDir = path.join(__dirname);

    // Check if compiled files exist
    const wasmFile = path.join(buildDir, "sudoku_js", "sudoku.wasm");
    const r1csFile = path.join(buildDir, "sudoku.r1cs");

    if (!fs.existsSync(wasmFile) || !fs.existsSync(r1csFile)) {
        console.log("Circuit not compiled. Run 'npm run compile:sudoku' first.");
        return;
    }

    // Test valid input
    console.log("Testing valid Sudoku input...");
    try {
        const input = JSON.parse(fs.readFileSync(path.join(testDir, "input.json"), "utf8"));
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmFile, r1csFile);
        console.log("✓ Valid input accepted");
    } catch (error) {
        console.log("✗ Valid input failed:", error.message);
    }

    // Test invalid input
    console.log("Testing invalid Sudoku input...");
    try {
        const input = JSON.parse(fs.readFileSync(path.join(testDir, "invalid.json"), "utf8"));
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmFile, r1csFile);
        console.log("✗ Invalid input was accepted (should have failed)");
    } catch (error) {
        console.log("✓ Invalid input correctly rejected:", error.message);
    }
}

testSudoku().catch(console.error);