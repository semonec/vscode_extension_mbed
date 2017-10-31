'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let commandOutput = null;
let compileIcon: vscode.StatusBarItem;
let flashIcon: vscode.StatusBarItem;
let logIcon: vscode.StatusBarItem;

const spawnCMD = require('spawn-command');

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-mbed" is now active!');

    // status bar item add
    compileIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    compileIcon.text = `$(diff-renamed) compile`;
    compileIcon.show();
    compileIcon.tooltip = 'Compile current mbed project';

    flashIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    flashIcon.text = `$(circuit-board) flash`;
    flashIcon.tooltip = 'Flash complied mbed binary into board';
    flashIcon.show();

    logIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    logIcon.text = `$(device-desktop) show output`;
    logIcon.tooltip = 'Show output mbed board';
    logIcon.show();

    commandOutput = vscode.window.createOutputChannel('MBED output');
    context.subscriptions.push(commandOutput);    
    // add 'mbed new'
    context.subscriptions.push(vscode.commands.registerCommand('extension.mbed.new', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        const openDialogOptions= {
            canSelectMany: false,
            canSelectFiles: false,
            canSelectFolders: true
        };

        vscode.window.showOpenDialog(openDialogOptions).then((uris) => {
            if (uris === undefined || uris.length !== 1) {
                vscode.window.showErrorMessage('Please select one folder for create MBED project');
                return;
            }
            const uri = uris[0];
            console.log('MBED>> create new mbed project directory:', uri);               
            vscode.window.showInputBox({
                placeHolder: 'Enter your new project\'s name'
            }).then((prjName) => {
                if (prjName === undefined) {
                    vscode.window.showErrorMessage('Please input project\'s name');
                    return;                    
                }
                console.log('MBED>> create new mbed project directory:', prjName);
                mbedNewProject(uri, prjName);
            });
        });
    }));
}

export function run(cmd:string, cwd:string): Promise<void> {
    return new Promise((accept, reject) => {
        let opts : any = {};
        if (vscode.workspace) {
        opts.cwd = cwd;
        }
        process = spawnCMD(cmd, opts);
        let printOutput = (data) => {
            commandOutput.append(data.toString());
        }
        process.stdout.on('data', printOutput);
        process.stderr.on('data', printOutput);
        process.on('close', (status) => {
        if (status) {
            reject(`Command \`${cmd}\` exited with status code ${status}.`);
        } else {
            accept();
        }
        process = null;
        });
    });
}

export function exec(cmd:string, cwd:string): Promise<void> {
    if (!cmd) {
        return;
    }
    commandOutput.clear();
    commandOutput.show();
    commandOutput.appendLine(`> Running \`${cmd}\`...`);
    return run(cmd, cwd);
}

export function mbedNewProject(path: vscode.Uri, prjName: string) {
    const cmd = `mbed new ${prjName}`;
    exec(cmd, path.path)
        .then(() => {
            vscode.window.showInformationMessage(`\`${cmd}\` ran successfully.`)
                .then(() => {
                    exec(`code ${prjName}`, path.path);
                });
        }).catch((reason) => {
            commandOutput.appendLine(`> ERROR: ${reason}`);
            vscode.window.showErrorMessage(reason, 'Show Output')
            .then((action) => { commandOutput.show(); });
        });
}

// this method is called when your extension is deactivated
export function deactivate() {
}