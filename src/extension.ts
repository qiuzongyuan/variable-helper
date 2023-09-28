import * as vscode from "vscode";
import VariableHelper, { VariableHelperKey } from "./VariableHelper";
import { isString, isArray, hasOwn } from "./util";

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
  const replaceTextMap: { [key:string]: vscode.Range [] } = {};
  const { selections, document: { uri } } = editor;
  for (const selection of selections) {
    const { active } = selection;
    const locations = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeReferenceProvider', uri, active);
      const text = editor.document.getText(selection);
      const helper = new VariableHelper(text);
      const replaceText = helper[name]?.();
       locations.forEach((location) => {
        const {
          range: {
            start: { line: startLine, character: startCharacter },
            end: { line: endLine, character: endCharacter },
          },
        } = location;
        const code = startLine + startCharacter + endLine + endCharacter;
        if (!codeSet.has(code) && isString(replaceText)) {
          if (isArray(replaceTextMap[replaceText])) {
            replaceTextMap[replaceText].push(new vscode.Range(startLine, startCharacter, endLine, endCharacter));
          } else {
            replaceTextMap[replaceText] = [new vscode.Range(startLine, startCharacter, endLine, endCharacter)];
          }
          codeSet.add(code);
        }
      });
  }

  editor.edit((editBuilder) => {
    for (const replaceText in replaceTextMap) {
      if (hasOwn(replaceTextMap, replaceText)) {
        const ranges = replaceTextMap[replaceText];
        ranges.forEach((range) => {
          editBuilder.replace(range, replaceText);
        });
      }
    }
  });

  // editor.setDecorations(highlightDecorationType, matches);

  // editor.edit((editBuilder) => {
  //   matches.forEach(match => {
  //     editBuilder.replace(match, "test");
  //   });
  // });
};

export function activate(context: vscode.ExtensionContext) {
  commands.forEach((command) => {
    const disposable = vscode.commands.registerCommand(command, () =>
      handler(command)
    );
    context.subscriptions.push(disposable);
  });
}
