import * as vscode from "vscode";
import VariableHelper, { VariableHelperKey } from "./VariableHelper";

const commands: VariableHelperKey[] = [
  "camelCase",
  "snakeCase",
  "kebabCase",
  "pascalCase",
  "screamingSnakeCase",
  "capitalizedSnakeCase",
  "spaceLowerCase",
  "spaceUpperCase",
];

const handler = (name: keyof VariableHelper) => {
  const helper = new VariableHelper();
  const text = helper[name]?.();
  helper.replaceText(text);
};

export function activate(context: vscode.ExtensionContext) {
  commands.forEach((command) => {
    const disposable = vscode.commands.registerCommand(command, () =>
      handler(command)
    );
    context.subscriptions.push(disposable);
  });
}
