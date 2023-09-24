import * as vscode from "vscode";

export default class VariableHelper {
  constructor() {
    this.extractWords();
  }
  private text:string = '';

  private words: string[] = [];

  extractWords() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return [];
    }
    const { selection } = editor;
    const text = editor.document.getText(selection); //选择文本
    this.text = text;
    const separator = " ";
    let convertText = text;
    const symbolReg = /[\-_\s]+(.)?/g;
    if (symbolReg.test(convertText)) {
      convertText = convertText.replace(symbolReg, separator + "$1");
    }
    const charReg = /[a-z][A-Z]/g;
    if (charReg.test(convertText)) {
      convertText = convertText.replace(charReg, (match) => match[0] + separator + match[1]);
    }
    convertText = convertText.toLocaleLowerCase();
    this.words = convertText.split(separator).filter((word) => word !== "");
  }

  checkText () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const { document } = editor;
    const regex = new RegExp(this.text, 'g');
    const fileContent = document.getText();
    const matches = fileContent.match(regex);
    if (matches && matches.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  replaceText(text?: unknown) {
    if (typeof text !== "string") {return;}
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const { selection, edit,document } = editor;
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(document.getText().length)
    );
    const fileContent = document.getText(fullRange);
    const updatedContent = fileContent.replace(this.text, text);
    edit((builder) => {
      builder.replace(selection, text); //替换选中文本
      // builder.replace(fullRange, text);
    });
    // const selectedText = document.getText(selection);
    // console.log('text', text);
    // const fileContent = document.getText();
    // const replacedText = fileContent.replace(new RegExp(this.text, 'g'), text);
    // const fullRange = new vscode.Range(
    //   document.positionAt(0),
    //   document.positionAt(document.getText().length)
    // );
    
    edit((builder) => {
      // builder.replace(fullRange, replacedText); //替换选中文本
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
    console.log('this.words', this.words);
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

  // Sentence Case
  sentenceCase () {
    return this.toPascalCase().join(" ");
  }

  // lower case
  lowerCase() {
    return this.words.join(" ");
  }

  // UPPER CASE
  upperCase() {
    return this.toUpperCase().join(" ");
  }
}

export type VariableHelperKey = keyof VariableHelper;
