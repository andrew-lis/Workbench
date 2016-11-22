"use strict";

import fs = require("fs");
import path = require("path");

import * as vscode from "vscode";


const DB_DIR = ".vscode";
const DB_FILE = `${DB_DIR}/workbench.json`;


export class Project {
    workbenches: Workbench[];
    currentWorkbench: Workbench;

    public load = () => {
        let dbFilePath = getDbFilePath(); 

        this.currentWorkbench = new Workbench();

        if (fs.existsSync(dbFilePath)) {
            let fileContent = fs.readFileSync(dbFilePath).toString();
            let fileObject = JSON.parse(fileContent);

            if (fileObject && fileObject["currentWorkbench"] && fileObject["currentWorkbench"]["files"]) {
                this.currentWorkbench.load(fileObject["currentWorkbench"]["files"]);
            }
        }
    }

    public save = () => {
        try {
            fs.accessSync(getDbFilePath(), fs.constants.R_OK | fs.constants.W_OK);
        } catch (e) {
            console.log("Workbench: file doesn't exist, creating dir...");

            try {
                fs.mkdirSync(getDbDirectoryPath());
            } catch(e) {
            }
        }

        fs.writeFileSync(getDbFilePath(), JSON.stringify(this, null, "\t"));
    }
}

export class Workbench {
    name: string;
    private files: File[];

    constructor() {
        this.files = []; 
    }

    public load = (json: any) => {
        this.removeAll();

        Array.from(json)
            .map((e: any) => new File(e.path, e.alias))
            .forEach(this.addFile);
    }

    public isEmpty = (): boolean => {
        return (this.files.length === 0);
    }

    public count = (): number => {
        return this.files.length;
    }

    public addFile = (file: File) => {
        this.files.push(file);

        project.save();
    }

    public remove = (file: File) => {
        this.files = this.files.filter(f => f !== file);

        project.save();
    }

    public removeAll = () => {
        this.files = [];

        project.save();
    }

    public findByPath = (path: string): File => {
        return this.files.find((f) => f.path === path) || null;
    }

    public findByAlias = (alias: string): File => {
        return this.files.find((f) => f.alias === alias);
    }

    public getAll = (): File[] => {
        return this.files.slice();
    }

    public getAliases = (): string[] => {
        return this.files.map((f) => f.alias).sort();
    }
}

export class File {
    path: string;
    alias: string;

    constructor(relativePath: string, alias: string) {
        this.path = relativePath;
        this.alias = alias;
    }

    public getAbsolutePath = (): string => {
        return path.join(vscode.workspace.rootPath, this.path);
    }
}

export let project: Project;

export function init() {
    project = new Project();
    project.load();
}

function getDbFilePath(): string {
    return path.join(vscode.workspace.rootPath, DB_FILE);
}

function getDbDirectoryPath(): string {
    return path.join(vscode.workspace.rootPath, DB_DIR);
}
