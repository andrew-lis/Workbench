"use strict";

import path = require("path");

import * as vscode from "vscode";

import * as model from "./model";


export async function onCommandListFiles() {
    let currentWorkbench = model.project.currentWorkbench;

    if (currentWorkbench.isEmpty()) {
        vscode.window.showWarningMessage("Workbench: No files available");
        return;
    }

    let selectedAlias = await vscode.window.showQuickPick(currentWorkbench.getAliases(), {
        placeHolder: "select a file to open"
    });

    if (selectedAlias) {
        let fileToOpen: model.File = currentWorkbench.findByAlias(selectedAlias);

        let document = await vscode.workspace.openTextDocument(fileToOpen.getAbsolutePath());
        
        vscode.window.showTextDocument(document, null, false);
    }
} 

export function onCommandAddFile() {
    let currentWorkbench = model.project.currentWorkbench;
    let file = vscode.workspace.asRelativePath(
        vscode.window.activeTextEditor.document.uri.fsPath);

    if (currentWorkbench.findByPath(file) === null) {
        let alias = `${currentWorkbench.count()} ${path.basename(file)}`;
        currentWorkbench.addFile(new model.File(file, alias));

        vscode.window.setStatusBarMessage(`Workbench: new file added: ${file}`);
    }
    else {
        vscode.window.showInformationMessage(`Workbench: file: ${file} already exists in current workbench`);
    }
}

export async function onCommandRemoveFile() {
    let currentWorkbench = model.project.currentWorkbench;

    if (currentWorkbench.isEmpty()) {
        vscode.window.showWarningMessage("Workbench: No files available");
        return;
    }

    let selectedAlias = await vscode.window.showQuickPick(currentWorkbench.getAliases(), {
        placeHolder: "select a file to remove"
    });
    
    if (selectedAlias) {
        let fileToRemove = currentWorkbench.findByAlias(selectedAlias);

        currentWorkbench.remove(fileToRemove);

        vscode.window.setStatusBarMessage("Workbench: file removed: " + fileToRemove.path);
    }
}

export function onCommandRemoveCurrentFile() {
    let currentWorkbench = model.project.currentWorkbench;

    if (currentWorkbench.isEmpty()) {
        vscode.window.showWarningMessage("Workbench: No files available");
    }

    let file = vscode.workspace.asRelativePath(
        vscode.window.activeTextEditor.document.uri.fsPath);
    let fileToRemove = currentWorkbench.findByPath(file);

    if (fileToRemove) {
        currentWorkbench.remove(fileToRemove);

        vscode.window.setStatusBarMessage("Workbench: file removed: " + fileToRemove.path);
    }
}

export async function onCommandClearFiles() {
    let selectedOption = await vscode.window.showQuickPick(["no", "yes"], <vscode.QuickPickOptions>{
        placeHolder: "are you sure - to clear all files from workspace?"
    });

    if (selectedOption === "yes")  {
        model.project.currentWorkbench.removeAll();

        vscode.window.setStatusBarMessage("Workbench: all files removed"); 
    }
}
