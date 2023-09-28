import * as vscode from "vscode";
import VariableHelper, { VariableHelperKey } from "./VariableHelper";
import { isNotEmptyString, isArray, hasOwn, isString } from "./util";

const commands: VariableHelperKey[] = [
  "camelCase",
  "snakeCase",
  "kebabCase",
  "pascalCase",
  "screamingSnakeCase",
  "capitalizedSnakeCase",
  "sentenceCase",
  "lowerCase",
  "upperCase",
];

const handler = async (name: keyof VariableHelper) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const codeSet = new Set();
  const replaceTextMap: { [path:string]:{ [text:string]: vscode.Range [] } } = {};
  const { selections, document: { uri } } = editor;
  for (const selection of selections) {
    const { active } = selection;
    const locations = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeReferenceProvider', uri, active);
    const text = editor.document.getText(selection);
    const helper = new VariableHelper(text);
    const replaceText = helper[name]?.();
    locations.forEach((location) => {
      const {
        uri: { path },
        range: {
          start: { line: startLine, character: startCharacter },
          end: { line: endLine, character: endCharacter },
        },
      } = location;
      const code = `${path}${startLine}${startCharacter}${endLine}${endCharacter}`;
      if (!codeSet.has(code) && isNotEmptyString(replaceText)) {
        const range = new vscode.Range(startLine, startCharacter, endLine, endCharacter);
        if (replaceTextMap[path] && isArray(replaceTextMap[path][replaceText])) {
          replaceTextMap[path][replaceText].push(range);
        } else {
          replaceTextMap[path] = { [replaceText]: [range] };
        }
        codeSet.add(code);
      }
    });
  }
  
  for (const path in replaceTextMap) {
    if (!hasOwn(replaceTextMap, path)) {
      continue;
    }
    const uri = vscode.Uri.file(path);
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);
    if (!editor) {
      continue;
    }
    editor.edit((editBuilder) => {
      const rangesMap = replaceTextMap[path];
      for (const replaceText in rangesMap) {
        if (!hasOwn(rangesMap, replaceText)) {
          continue;
        }
        const ranges = rangesMap[replaceText];
        ranges.forEach((range) => {
          editBuilder.replace(range, replaceText);
        });
      }
    });
  }
};

export function activate(context: vscode.ExtensionContext) {
  commands.forEach((command) => {
    const disposable = vscode.commands.registerCommand(command, () =>
      handler(command)
    );
    context.subscriptions.push(disposable);
  });
}
