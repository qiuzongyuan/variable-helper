import { window, commands, Range, Location, ExtensionContext, workspace, Uri } from "vscode";
import VariableHelper, { VariableHelperKey } from "./VariableHelper";
import { isNotEmptyString, isArray, hasOwn } from "./util";

const commandList: VariableHelperKey[] = [
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
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const codeSet = new Set();
  const replaceTextMap: { [path:string]:{ [text:string]: Range [] } } = {};
  const { selections, document: { uri } } = editor;
  for (const selection of selections) {
    const { active } = selection;
    const locations = await commands.executeCommand<Location[]>('vscode.executeReferenceProvider', uri, active);
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
        const range = new Range(startLine, startCharacter, endLine, endCharacter);
        if (replaceTextMap[path] && isArray(replaceTextMap[path][replaceText])) {
          replaceTextMap[path][replaceText].push(range);
        } else {
          replaceTextMap[path] = { [replaceText]: [range] };
        }
        codeSet.add(code);
      }
    });
  }
  const curUri = editor.document.uri;
  let curEditor = editor;
  for (const path in replaceTextMap) {
    if (!hasOwn(replaceTextMap, path)) {
      continue;
    }
    const uri = Uri.file(path);
    if (curUri.toString() !== uri.toString()) {
      const document = await workspace.openTextDocument(uri);
      curEditor = await window.showTextDocument(document);
    }
    if (!curEditor) {
      continue;
    }
    curEditor.edit((editBuilder) => {
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

export function activate(context: ExtensionContext) {
  commandList.forEach((command) => {
    const disposable = commands.registerCommand(command, () =>
      handler(command)
    );
    context.subscriptions.push(disposable);
  });
}
