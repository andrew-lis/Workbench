# Workbench - the VSCode Extension

Group favorite files into a workbench!

The purpose of this extension is to be a small helper that collects all your favorite files 
together (into a workbench) and provides an easy navigation between them. 

This is a beta version. Please read the roadmap and raise an issue if you see how this extension can be 
made better!

## Usage

Mark a file as favorite from the Command Palette or editor’s Title Menu.

![adding a file from title menu](images/showAddingFromContext.gif)

Browse favorite files with a `Alt+Q` shortcut (type to filter by alias):

![browsing files](images/showBrowsingFiles.gif)

## Features

* Adding a file to the workbench (command: `Workbench: Add File`)
  * As a relative path
  * Duplicates are rejected
* Listing files from a workbench (i.e. browsing favorites)
  * Command: `Workbench: List Files`
  * Shortcut: `Alt+Q` (works in the editor and on explorer)
  * An alias is created with a prefix number
  * The list is sorted by alias
* Removing an opened file from the workbench (command: `Workbench: Remove Current File`)
* Removing chosen file from the workbench (command: `Workbench: Remove Chosen File`)
* Removing all files (i.e. clearing the workbench) (command: `Workbench: Clear All Files`)
  * With confirmation dialog
* Data are stored as an easily accessible JSON file
  * Location: `./.vscode/workbench.json`

## Development Notes

* TypeScript 2 is used
* Promises are handled with `await` operator

## Roadmap

* External editions of storage file (`workbench.json`) should trigger a reload of in-memory data
* Editing file aliases 
* [Epic] Switch between multiple workbenches 

## Known Issues

* *Editing an alias requires also resetting the VSCode.* File aliases can be renamed to anything by 
editing the `workbench.json` file. But the file is not reloaded. The workaround is to 
reset the vscode. There are features on the roadmap to enable automatic reloads and allow alias editing 
from a command.

## Release Notes

### 0.1.0 (2016.11.01)

* Removed "preview" flag from marketplace configuration
* Better numbering for aliases with numbers above nine

### 0.0.2 (2016.10.14)

Initial release.
