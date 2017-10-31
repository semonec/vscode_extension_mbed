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
    compileIcon.tooltip = 'Compile current mbed project';
    compileIcon.command = 'extension.mbed.compile';    
    compileIcon.show();

    flashIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    flashIcon.text = `$(circuit-board) flash`;
    flashIcon.tooltip = 'Flash complied mbed binary into board';
    flashIcon.command = 'extension.mbed.flash';        
    flashIcon.show();

    logIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    logIcon.text = `$(plug) serial monitor`;
    logIcon.tooltip = 'Open serial monitor';
    logIcon.command = 'extensio.mbed.serialMonitor';
    logIcon.show();

    commandOutput = vscode.window.createOutputChannel('mbed tasks');
    context.subscriptions.push(commandOutput);    
    // add 'mbed new'
    context.subscriptions.push(vscode.commands.registerCommand('extension.mbed.new', () => {
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
    context.subscriptions.push(vscode.commands.registerCommand('extension.mbed.compile', () => {
        mbedCompileProject();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.mbed.flash', () => {
        mbedCompileAndFlashProject();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.mbed.serialMonitor', () => {
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

export function mbedCompileProject() {
    const cmd = `mbed compile -t GCC_ARM -m auto`;
    const folder = vscode.workspace.workspaceFolders;
    if (vscode.workspace.workspaceFolders === undefined || vscode.workspace.workspaceFolders.length === 0) {
        return;
    }
    const path = vscode.workspace.workspaceFolders[0].uri.path;
    exec(cmd, path)
        .then(() => {
            vscode.window.showInformationMessage(`Successfully complied`)
        }).catch((reason) => {
            commandOutput.appendLine(`> ERROR: ${reason}`);
            vscode.window.showErrorMessage(reason, 'Show Output')
            .then((action) => { commandOutput.show(); });
        });
}

export function mbedCompileAndFlashProject() {
    const cmd = `mbed compile -t GCC_ARM -m auto -f`;
    const folder = vscode.workspace.workspaceFolders;
    if (vscode.workspace.workspaceFolders === undefined || vscode.workspace.workspaceFolders.length === 0) {
        return;
    }
    const path = vscode.workspace.workspaceFolders[0].uri.path;
    exec(cmd, path)
        .then(() => {
            vscode.window.showInformationMessage(`Successfully complied`)
        }).catch((reason) => {
            commandOutput.appendLine(`> ERROR: ${reason}`);
            vscode.window.showErrorMessage(reason, 'Show Output')
            .then((action) => { commandOutput.show(); });
        });
}

// this method is called when your extension is deactivated
export function deactivate() {
}