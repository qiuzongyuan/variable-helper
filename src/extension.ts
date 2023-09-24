import * as vscode from "vscode";
import VariableHelper, { VariableHelperKey } from "./VariableHelper";
import { isString } from "./util";

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

const handler = (name: keyof VariableHelper) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { selections } = editor;
  editor.edit((editBuilder) => {
    selections.forEach((selection) => {
      const text = editor.document.getText(selection);
      const helper = new VariableHelper(text);
      const replaceText = helper[name]?.();
      if (isString(replaceText)){
        editBuilder.replace(selection, replaceText);
      }
    });
  });
};

export function activate(context: vscode.ExtensionContext) {
  commands.forEach((command) => {
    const disposable = vscode.commands.registerCommand(command, () =>
      handler(command)
    );
    context.subscriptions.push(disposable);
  });
}
