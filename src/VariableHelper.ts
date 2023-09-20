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

  // camelCase
  camelCase() {
    const words = this.words.map((word, index) => {
      if (index > 0) {
        return word.replace(/^[a-z]/, (match) => match.toLocaleUpperCase());
      }
      return word;
    });
    return words.join("");
  }

  // snake_case
  snakeCase() {
    return this.words.join("_");
  }

  // kebab-case
  kebabCase() {
    return this.words.join("-");
  }

  toPascalCase() {
    const words = this.words.map((word) =>
      word.replace(/^[a-z]/, (match) => match.toLocaleUpperCase())
    );
    return words;
  }

  // PascalCase
  pascalCase() {
    return this.toPascalCase().join("");
  }

  toUpperCase() {
    return this.words.map((word) => word.toLocaleUpperCase());
  }

  // SCREAMING_SNAKE_CASE
  screamingSnakeCase() {
    return this.toUpperCase().join("_");
  }

  // Capitalized_Snake_Case
  capitalizedSnakeCase() {
    return this.toPascalCase().join("_");
  }

  // space lower case
  spaceLowerCase() {
    return this.words.join(" ");
  }

  // SPACE UPPER CASE
  spaceUpperCase() {
    return this.toUpperCase().join(" ");
  }
}

export type VariableHelperKey = keyof VariableHelper;
