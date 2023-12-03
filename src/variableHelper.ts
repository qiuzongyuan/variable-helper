export default class VariableHelper {
  constructor(text: string) {
    this.extractWords(text);    
  }
  
  private text:string = '';

  private words: string[] = [];

  private extractWords(text:string) {
    this.text = text;
    const separator = '_';
    let convertText = text;
    convertText = convertText.replace(/(?<=[A-Za-z])[\-_\x20]+(?=[A-Za-z])/g,  separator);
    convertText = convertText.replace(/(?<=[a-z])[A-Z]/g, match => `${separator}${match}`);
    convertText = convertText.toLocaleLowerCase();
    this.words = convertText.split(separator).filter((word) => word !== '');
  }

  // camelCase
  camelCase() {
    const words = this.words.map((word, index) => {
      if (index > 0) {
        return word.replace(/^[a-z]/, (match) => match.toLocaleUpperCase());
      }
      return word;
    });
    return words.join('');
  }

  // snake_case
  snakeCase() {
    return this.words.join('_');
  }

  // kebab-case
  kebabCase() {
    return this.words.join('-');
  }

  toPascalCase() {
    const words = this.words.map((word) =>
      word.replace(/\b[a-z]/g, (match) => match.toLocaleUpperCase())
    );
    return words;
  }

  // PascalCase
  pascalCase() {
    return this.toPascalCase().join('');
  }

  toUpperCase() {
    return this.words.map((word) => word.toLocaleUpperCase());
  }

  // SCREAMING_SNAKE_CASE
  screamingSnakeCase() {
    return this.toUpperCase().join('_');
  }

  // Capitalized_Snake_Case
  capitalizedSnakeCase() {
    return this.toPascalCase().join('_');
  }

  // Sentence Case
  sentenceCase () {
    return this.toPascalCase().join(' ');
  }

  // lower case
  lowerCase() {
    return this.words.join(' ');
  }

  // UPPER CASE
  upperCase() {
    return this.toUpperCase().join(' ');
  }
}

export type VariableHelperKey = keyof VariableHelper;
