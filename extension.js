// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var nls = require('vscode-nls');
var localize = nls.config(process.env.VSCODE_NLS_CONFIG)(__filename);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context)
{
    var quickActionDisposable = vscode.commands.registerCommand('search-the-web.search', function () {
        search();
    });
    context.subscriptions.push(quickActionDisposable);

    var actionListDisposable = vscode.commands.registerCommand('search-the-web.searchTheWebActionList', function () {
        showActionList(true);
    });
    context.subscriptions.push(actionListDisposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function search()
{
    var selectedText = getSelection();

    if (selectedText == "") {
        vscode.window.showInformationMessage(localize(0, null));

		return;
    }

	// Filter by lang
	var lang = getLang();
	var actionList = getFilteredActionList(lang, false);

	if (!(Array.isArray(actionList) && actionList.length)) {
		vscode.window.showWarningMessage(localize(2, null));

		return;
	}

	var action = null;

	// If more than one action is available get the default one
	if (actionList.length > 1) {
		var defaultActionList = actionList.filter(
			action => action.hasOwnProperty("defaultFor") && action.defaultFor.includes(lang)
		);

		if (Array.isArray(defaultActionList) && defaultActionList.length) {
			action = defaultActionList[0].url;
		}
	} 
	
	if (action === null) {
		action = actionList[0].url;
	}
	
	// Execute first action available
	openUrlInBrowser(action, selectedText);
}

function showActionList()
{
    var selectedText = getSelection();

    if (selectedText == "") {
        vscode.window.showInformationMessage(localize(0, null));

		return;
    }

	// Filter by lang
	var lang = getLang();
	var actionList = getFilteredActionList(lang, true);

	if (!(Array.isArray(actionList) && actionList.length)) {
		vscode.window.showWarningMessage(localize(2, null));

		return;
	}

	vscode.window.showQuickPick(actionList, {
		placeHolder: localize(1, null),
	}).then(function (selectedItem) {
		if (selectedItem && (selectedItem.url != '')) {
			openUrlInBrowser(selectedItem.url, selectedText, lang);
		}
	}).then(function () {});
}

// Get action list filtered by lang
function getFilteredActionList(lang)
{
	var config = vscode.workspace.getConfiguration('search-the-web');
	var actionList = config.get('actionList');

	if (!(Array.isArray(actionList) && actionList.length)) {
		return false;
	}

	return actionList.filter(action => action.languages.includes('*') || action.languages.includes(lang));
}

function getSelection()
{
    var editor = vscode.window.activeTextEditor;

	if (!editor) {
        return '';
    }

    var selection = editor.selection;
    var text = editor.document.getText(selection).trim();
    text = text.replace(/\s\s+/g, ' ');

	// If selection is empty try to get the word at current cursor position
	if (text.length == 0) {
		var wordAtCursorRange = editor.document.getWordRangeAtPosition(selection.end);
		
		if (wordAtCursorRange !== undefined) {
			text = editor.document.getText(wordAtCursorRange);
		}
	}
	
    return text;
}

function getLang()
{
    var lang = "";
    var editor = vscode.window.activeTextEditor;

    if (editor) {
		lang = editor.document.languageId;
	}

	return lang;
}

function openUrlInBrowser(urlPattern, selectedText, lang = "")
{
	if (lang == "plaintext" || lang == "diff") {
		lang = "";
	}
	
    var encodedLang = encodeURI(lang);
    var encodedSelection = encodeURI(selectedText);
    var url = urlPattern.replace("%LANG%", encodedLang).replace("%SELECTION%", encodedSelection);

    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
}

module.exports = {
	activate,
	deactivate
}
