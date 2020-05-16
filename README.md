# Search the web

This extension allows you to open the default browser and search the selected text using a set of predefined URLs.

Fork from **Open in web** by **VCaveman**\
https://marketplace.visualstudio.com/items?itemName=VCaveman.open-in-web


## Features

You can set an array of URL patterns and define the languages they will be available for.

A default action can be set for any language.

The `"Search the web"` command opens the default browser with the default action for the current document language.

The `"Search the web using..."` command displays a list of URLs that match the current document language.

These two options show in the context menu after text selection.

Default configuration uses some of the original URLs and a few more:
- Google Search
- Google Search including the language name
- DuckDuckGo Search
- DuckDuckGo Search including the language name
- PHP Help
- Mozilla Developer


## Extension Settings

You can specify any web sites you want to use with the extension in the `search-the-web.actionList` configuration.

An action is defined by:
- `label`: the text that will be shown in the selection list.
- `url`: the URL template. It can contain `%SELECTION%` and `%LANG%` keywords.
  - `%SELECTION%` will be replaced by selected text.
  - `%LANG%` will be replaced by current file language (html, javascript, xml...)
- `languages`: array of languages that the URL can be used with
  - `*` means it will be available for any language.
- `defaultFor`: optional property with an array of languages that this URL will be the default one. Here you can set the default action for a language.

> If more than one action is available for the current language, the first one where `defaultFor` includes the language will be used.
>
> If there is no default action defined for a language the first action from the list of all available actions will be chosen.

Extension default settings:

```json
"search-the-web.actionList": [
	{
		"languages": [
			"*"
		],
		"url": "https://www.google.com/search?q=%SELECTION%",
		"label": "%actionList.googleSearch%"
	},
	{
		"languages": [
			"*"
		],
		"url": "https://www.google.com/search?q=%LANG%%20%SELECTION%",
		"label": "%actionList.googleSearchWithLang%"
	},
	{
		"languages": [
			"*"
		],
		"url": "https://duckduckgo.com/?q=%SELECTION%",
		"label": "%actionList.duckDuckGoSearch%"
	},
	{
		"languages": [
			"*"
		],
		"url": "https://duckduckgo.com/?q=%LANG%%20%SELECTION%",
		"label": "%actionList.duckDuckGoSearchWithLang%"
	},
	{
		"languages": [
			"php"
		],
		"defaultFor": ["php"],
		"url": "https://www.php.net/search.php?show=quickref&pattern=%SELECTION%",
		"label": "%actionList.phpHelpSearch%"
	},
	{
		"languages": [
			"html",
			"php",
			"javascript",
			"css"
		],
		"defaultFor": ["html", "javascript", "css"],
		"url": "https://developer.mozilla.org/es/search?q=%SELECTION%",
		"label": "%actionList.mozillaDeveloperSearch%"
	}
]

```

## TODO

Add localization for other languages.

## Known Issues

None at the moment.

## Release Notes

### 0.0.1 (2020-05-16)

- Initial release.

## License

MIT
