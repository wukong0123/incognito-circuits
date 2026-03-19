const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

const testCases = [
    { file: "input.json", expected: true, description: "Valid Sudoku (original)" },
    { file: "valid2.json", expected: true, description: "Valid Sudoku (shifted)" },
    { file: "invalid.json", expected: false, description: "Invalid Sudoku (row duplicate)" },
    { file: "invalid_column.json", expected: false, description: "Invalid Sudoku (column duplicate)" },
    { file: "invalid_box.json", expected: false, description: "Invalid Sudoku (box duplicate)" },
    { file: "invalid_range.json", expected: false, description: "Invalid Sudoku (out of range)" }
];

async function testSudoku() {
    console.log("Testing Sudoku circuit...\n");

    const buildDir = path.join(__dirname, "../build");
    const testDir = path.join(__dirname);

    // Check if compiled files exist
    const wasmFile = path.join(buildDir, "main_js", "main.wasm");
    const r1csFile = path.join(buildDir, "main.r1cs");
    const zkeyFile = path.join(buildDir, "main_0001.zkey");
    const vkeyFile = path.join(buildDir, "verification_key.json");

    if (!fs.existsSync(wasmFile) || !fs.existsSync(r1csFile) || !fs.existsSync(zkeyFile) || !fs.existsSync(vkeyFile)) {
        console.log("Circuit not fully set up. Run 'npm run setup' first.\n");
        return;
    }

    let passed = 0;
    let total = testCases.length;

    for (const testCase of testCases) {
        const inputPath = path.join(testDir, testCase.file);
        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  Skipping ${testCase.description}: ${testCase.file} not found`);
            continue;
        }

        console.log(`Testing: ${testCase.description}`);
        try {
            const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
            const startTime = Date.now();
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmFile, zkeyFile);
            const endTime = Date.now();

            // Verify the proof
            const vKey = JSON.parse(fs.readFileSync(vkeyFile, "utf8"));
            const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

            if (testCase.expected && res) {
                console.log(`  ✓ Passed (${endTime - startTime}ms)`);
                passed++;
            } else if (!testCase.expected && !res) {
                console.log(`  ✓ Correctly rejected (${endTime - startTime}ms)`);
                passed++;
            } else if (testCase.expected && !res) {
                console.log(`  ✗ Failed: Proof generated but verification failed`);
            } else {
                console.log(`  ✗ Failed: Expected rejection but proof was verified`);
            }
        } catch (error) {
            if (!testCase.expected) {
                console.log(`  ✓ Correctly rejected: ${error.message.split('\n')[0]}`);
                passed++;
            } else {
                console.log(`  ✗ Failed: Expected acceptance but got error: ${error.message.split('\n')[0]}`);
            }
        }
        console.log("");
    }

    console.log(`Results: ${passed}/${total} tests passed`);
    if (passed === total) {
        console.log("All tests passed!");
    } else {
        console.log("Some tests failed.");
    }
}

testSudoku().catch(console.error);