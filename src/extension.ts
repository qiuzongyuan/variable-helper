import {
  window,
  commands,
  Range,
  Location,
  ExtensionContext,
  workspace,
  Uri,
  Selection,
  TextEditor,
} from 'vscode';
import VariableHelper, { VariableHelperKey } from './variableHelper';
import { isEmptyArray, isArray, hasOwn, isString, isEmptyString } from './util';

const commandList: VariableHelperKey[] = [
  'camelCase',
  'snakeCase',
  'kebabCase',
  'pascalCase',
  'screamingSnakeCase',
  'capitalizedSnakeCase',
  'sentenceCase',
  'lowerCase',
  'upperCase',
];

const handler = async (name: keyof VariableHelper) => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const codeSet = new Set();
  const replaceTextMap: {
    [path: string]: { [text: string]: (Range | Selection)[] };
  } = {};
  const { selections, document } = editor;
  const { uri } = document;
  for (const selection of selections) {
    const { active } = selection;
    const text = editor.document.getText(selection);
    const helper = new VariableHelper(text);
    const replaceText = helper[name]?.();
    if (!isString(replaceText) || isEmptyString(replaceText)) {
      continue;
    }
    const definitions = await commands.executeCommand(
      'vscode.executeDefinitionProvider',
      uri,
      active
    );
    if (isEmptyArray(definitions)) {
      const { path } = uri;
      if (replaceTextMap[path] && isArray(replaceTextMap[path][replaceText])) {
        replaceTextMap[path][replaceText].push(selection);
      } else {
        replaceTextMap[path] = {
          ...replaceTextMap[path],
          [replaceText]: [selection],
        };
      }
    } else {
      const locations = await commands.executeCommand<Location[]>(
        'vscode.executeReferenceProvider',
        uri,
        active
      );
      locations.forEach((location) => {
        const {
          uri: { path },
          range: {
            start: { line: startLine, character: startCharacter },
            end: { line: endLine, character: endCharacter },
          },
        } = location;
        const code = `${path}${startLine}${startCharacter}${endLine}${endCharacter}`;
        if (!codeSet.has(code)) {
          const range = new Range(
            startLine,
            startCharacter,
            endLine,
            endCharacter
          );
          if (
            replaceTextMap[path] &&
            isArray(replaceTextMap[path][replaceText])
          ) {
            replaceTextMap[path][replaceText].push(range);
          } else {
            replaceTextMap[path] = {
              ...replaceTextMap[path],
              [replaceText]: [range],
            };
          }
          codeSet.add(code);
        }
      });
    }
  }
  const curUri = uri;
  let curEditor: TextEditor = editor;
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
