import * as vscode from 'vscode';
import VariableHelper from './VariableHelper';
const commands = [
	{
		name: 'convert',
		fnName: 'test'
	}
];
const handler = (fnName: typeof VariableHelper[keyof typeof VariableHelper]) => {
	const helper = new VariableHelper;
	helper[fnName]?.();
};

export function activate(context: vscode.ExtensionContext) {
	commands.forEach((command) => {
		const disposable = vscode.commands.registerCommand("convert", () => handler('test'));
		context.subscriptions.push(disposable);
	});
	// 注册右键菜单命令
// const disposable = vscode.commands.registerCommand('convert', () => {
// 	// 在此处编写右键菜单命令的逻辑
// 	// const words = extractWords();
// 	// replaceText(words.join('_'));
// 	// vscode.window.showInformationMessage();	
// });

}

// This method is called when your extension is deactivated
export function deactivate() {}
