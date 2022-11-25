# Technical Design

> Guide for the implementation, including detailed design, priorities, coding conventions, and testing

Highlights:

* OOP
* TDD

## Code structure

 - __src__: Typescript source code


 - __test__: Node.js unit tests. Please prefer `zest` unit tests whenever possible.

 - __spec__: [baldrick-zest unit regression tests](https://github.com/flarebyte/baldrick-zest-engine)

 - __pest-spec__: [baldrick-pest acceptance tests](https://github.com/flarebyte/baldrick-pest)

 - __script__: Folder for bash, python, zx or ts-node scripts

 - __dist__: Temporary folder for building distribution code
 
 - __temp__: Temporary folder used by some of the tooling (tests...)

 - __report__: Temporary folder for reporting; usually for continuous integration

 - __.github__: Folder for github pipeline

 - __.vscode__: Folder for visual code snippets

## Useful links

 - Guideline for [Clean Code in Typescript](https://labs42io.github.io/clean-code-typescript/)

 - [Supporting node.js ESM](https://the-guild.dev/blog/support-nodejs-esm)
- [Usage](USAGE.md)