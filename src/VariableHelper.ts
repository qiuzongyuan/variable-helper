import * as vscode from "vscode";

export default class VariableHelper {
  constructor(text: string) {
    this.extractWords(text);
  }
  
  private text:string = '';

  private words: string[] = [];

  private extractWords(text:string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    this.text = text;
    const separator = " ";
    let convertText = text;
    convertText = convertText.replace(/[\-_\s]+(.)?/g,  `${separator}$1`);
    convertText = convertText.replace(/[a-z][A-Z]/g, match => `${match[0]}${separator}${match[1]}`);
    convertText = convertText.replace(/[A-Z][a-z]/g, match => `${separator}${match}`);
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
