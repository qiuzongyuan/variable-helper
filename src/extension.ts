import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// 注册右键菜单命令
const disposable = vscode.commands.registerCommand('myCommand', () => {
	// 在此处编写右键菜单命令的逻辑
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	};
	const { selection } = editor;
	const text = editor.document.getText(selection);//选择文本
	// if (text) {
	// 	vscode.window.showInformationMessage(text);	
	// }
	editor.edit((builder) => {
		builder.replace(selection, "测试");//替换选中文本
	});
});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
