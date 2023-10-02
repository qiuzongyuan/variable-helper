import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../../extension';
import VariableHelper from '../../variableHelper';
suite('Extension Test', () => {
	test('VariableHelper Test', () => {
		const text = 'helloWord';
		const variableHelper = new VariableHelper(text);
		assert.strictEqual(variableHelper.camelCase(), 'helloWord');
		assert.strictEqual(variableHelper.pascalCase(), 'HelloWord');
		assert.strictEqual(variableHelper.kebabCase(), 'hello-word');
		assert.strictEqual(variableHelper.snakeCase(), 'hello_word');
		assert.strictEqual(variableHelper.screamingSnakeCase(), 'HELLO_WORD');
		assert.strictEqual(variableHelper.capitalizedSnakeCase(), 'Hello_Word');
		assert.strictEqual(variableHelper.sentenceCase(), 'Hello Word');
		assert.strictEqual(variableHelper.lowerCase(), 'hello word');
		assert.strictEqual(variableHelper.upperCase(), 'HELLO WORD');
	});
});
