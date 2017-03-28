"use strict";

import * as vscode from "vscode";

import * as model from "./model";
import * as commands from "./commands";

const version = "0.1.4";

const supportedCommands = {
    "workbench.addFile": commands.onCommandAddFile,
    "workbench.listFiles": commands.onCommandListFiles,
    "workbench.openAll": commands.onCommandOpenAll,
    "workbench.removeFile": commands.onCommandRemoveFile,
    "workbench.removeCurrentFile": commands.onCommandRemoveCurrentFile,
    "workbench.clearFiles": commands.onCommandClearFiles,
    "workbench.openConfig": commands.onOpenConfig,
    "workbench.reloadConfig": commands.onReloadConfig,
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
