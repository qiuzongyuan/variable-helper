import * as vscode from "vscode";

export default class VariableHelper {
  constructor() {
    this.extractWords();
  }
  private words: string[] = [];

  extractWords() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return [];
    }
    const { selection } = editor;
    const text = editor.document.getText(selection); //选择文本
    const separator = " ";
    const charReg = /[A-Z][a-z]?/g;
    let convertText = text;
    if (charReg.test(convertText)) {
      convertText = convertText.replace(charReg, (match) => separator + match);
    }
    const symbolReg = /[\-_\s]+(.)?/g;
    if (symbolReg.test(text)) {
      convertText = convertText.replace(symbolReg, separator + "$1");
    }
    convertText = convertText.toLocaleLowerCase();
    this.words = convertText.split(separator).filter((word) => word !== "");
    console.log(this.words);
  }

  replaceText(text?: unknown) {
    if (typeof text !== "string") return;
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const { selection, edit } = editor;
    edit((builder) => {
      builder.replace(selection, text); //替换选中文本
    });
  }

  camelCase() {
    const words = this.words.map((word, index) => {
      if (index > 0) {
        return word.replace(/^[a-z]/, (match) => match.toLocaleUpperCase());
      }
      return word;
    });
    return words.join("");
  }

  snakeCase() {
    return this.words.join("_");
  }

  kebabCase() {
    return this.words.join("-");
  }

  pascalCase() {
    const words = this.words.map((word) =>
      word.replace(/^[a-z]/, (match) => match.toLocaleUpperCase())
    );
    return words.join("");
  }

  toUpperCase() {
    return this.words.map((word) => word.toLocaleLowerCase());
  }

  screamingSnakeCase() {
    return this.toUpperCase().join("_");
  }

  capitalizedSnakeCase() {
    const words = this.words.map((word) =>
      word.replace(/^[a-z]/, (match) => match.toLocaleUpperCase())
    );
    return words.join("_");
  }

  spaceLowerCase() {
    return this.words.join(" ");
  }

  spaceUpperCase() {
    return this.toUpperCase().join(" ");
  }
}

export type VariableHelperKey = keyof VariableHelper;
