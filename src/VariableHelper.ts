import * as vscode from 'vscode';

export default class VariableHelper {
  constructor () {
    this.extractWords();
  }
  words:string [] = [];

  extractWords () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return [];
    };
    const { selection } = editor;
    const text = editor.document.getText(selection);//选择文本
    const separator = ' ';
    const symbolReg = /[\-_\s]+(.)?/g;
    let convertText = text;
    if (symbolReg.test(text)) {
      convertText = convertText.replace(symbolReg, separator + "$1");
    }
    const charReg = /[a-zA-Z][A-Z]/g;
    if (charReg.test(convertText)) {
      convertText = convertText.replace(charReg,  (match) => match[0] + separator + match[1]);
    }
    convertText = convertText.toLocaleLowerCase();
    this.words = convertText.split(separator);
    console.log(this.words);
  }

  replaceText (text: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    };
    const { selection, edit } = editor;
    edit((builder) => {
      builder.replace(selection, text);//替换选中文本
    });
  };


  test() {
    console.log('test');
  }
  
}