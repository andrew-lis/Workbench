"use strict";

import * as vscode from "vscode";

import * as model from "./model";
import * as commands from "./commands";

const version = "0.0.2";

const supportedCommands = {
    "workbench.addFile": commands.onCommandAddFile,
    "workbench.listFiles": commands.onCommandListFiles,
    "workbench.removeFile": commands.onCommandRemoveFile,
    "workbench.removeCurrentFile": commands.onCommandRemoveCurrentFile,
    "workbench.clearFiles": commands.onCommandClearFiles
};

export function activate(context: vscode.ExtensionContext) {
    console.log(`Extension 'Workbench' is active (ver: ${version})`);

    Object.keys(supportedCommands).forEach((command) => {
        let handler = supportedCommands[command];
        let disposable = vscode.commands.registerCommand(command, handler);
        context.subscriptions.push(disposable);
    });

    model.init();

    console.log("Extension 'Workbench' is initialized");
}

export function deactivate() {
}
