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
        
        showDocument(document);
    }
} 

export async function onCommandOpenAll() {
    let currentWorkbench = model.project.currentWorkbench;

    if (currentWorkbench.isEmpty()) {
        vscode.window.showWarningMessage("Workbench: No files available");
        return;
    }

    currentWorkbench.getAll().forEach(async file => {
        let document = await vscode.workspace.openTextDocument(file.getAbsolutePath());
        
        showDocument(document);
    });
} 

export function onCommandAddFile() {
    let currentWorkbench = model.project.currentWorkbench;
    let file = getActiveEditorFilePath();

    if (!file) {
        return;
    }

    let prefixWithDir = getConfigurationPrefixAliasWithDirName();

    if (currentWorkbench.findByPath(file) === null) {
        let prefixNumber = currentWorkbench.count() + 1;
        let prefixPad = (prefixNumber < 10 ? " " : "");
        let parentDirName = "";

        if (prefixWithDir) {
            let fullPath = vscode.window.activeTextEditor.document.uri.fsPath;
            parentDirName = path.dirname(fullPath).split(path.sep).pop() + "/";
        }

        let filename = path.basename(file);
        let alias = `${prefixPad}${prefixNumber} ${parentDirName}${filename}`;

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

    let file = getActiveEditorFilePath();

    if (!file) {
        return;
    }

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

export async function onOpenConfig() {
    let dbFilePath = model.getDbFilePath();

    if (!dbFilePath) {
        return;
    }

    model.project.save();

    let document = await vscode.workspace.openTextDocument(dbFilePath);

    showDocument(document);
}

export async function onReloadConfig() {
    model.project.load();
}

function getActiveEditorFilePath(): string {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showWarningMessage("Workbench: No file is open");
        return null;
    }

    return vscode.workspace.asRelativePath(
        vscode.window.activeTextEditor.document.uri.fsPath);
}

function showDocument(document: vscode.TextDocument): void {
    let viewColumn: vscode.ViewColumn = (vscode.window.activeTextEditor && vscode.window.activeTextEditor.viewColumn
        ? vscode.window.activeTextEditor.viewColumn
        : vscode.ViewColumn.One);

    vscode.window.showTextDocument(document, viewColumn, false);
}

function getConfigurationPrefixAliasWithDirName(): boolean {
    let configuration = vscode.workspace.getConfiguration('foxWorkbench');
    return configuration['prefixAliasWithDirName'];
}