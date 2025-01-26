console.log('hello seller-re');

const {fork} = require("child_process");
const path = require("path");

const startupFile = path.join(__dirname, "startup.js");

function forkService() {
    
    const child = fork(startupFile, process.argv, {silent: true});
    child.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
        console.error('child data ERROR : ', data.toString());
    });

    child.on('close', (code) => {
        if (code === 0 || code === 2) {
            process.exit(code);
        }
        setTimeout(() => {
            console.log('RESTART');
            forkService();
        }, 1000)
    });

    process.on('SIGINT', () => {
        console.log('Parent process terminated. Killing child process...');
        child.kill(); // 자식 프로세스 종료
        process.exit(0);
    });
}


function run() {
    forkService();
    process.on('SIGINT', () => {
    });
}

run();