const { spawn } = require('child_process');
const path = require('path');

async function generateChart(chartData) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [path.join(__dirname, '../chart_generator.py')]);
        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
            console.error('Python stderr:', error);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python process error:', error);
                reject(new Error(`Python process exited with code ${code}: ${error}`));
            } else {
                resolve(result.trim());
            }
        });

        pythonProcess.stdin.write(chartData);
        pythonProcess.stdin.end();
    });
}

module.exports = {
    generateChart
}; 