import { ExampleView, VIEW_TYPE_EXAMPLE } from "CustomView";
import {
	addIcon,
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	WorkspaceLeaf,
} from "obsidian";

// Remember to rename these classes and interfaces!
//
// Custom views need to be registered when the plugin is enabled,
// and cleaned up when the plugin is disabled:

interface MyPluginSettings {
	mySetting: string;
	openAiKey: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
	openAiKey: "openAiKeyTBD",
};

export default class NemesisPlugin extends Plugin {
	settings: MyPluginSettings;

	async activateView() {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);
		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Create a new leaf in the right sidebar
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({
					type: VIEW_TYPE_EXAMPLE,
					active: true,
				});
			}
		}
	}

	async onload() {
		await this.loadSettings();

		console.log("loading plugin");

		// This creates an icon in the left ribbon.
		addIcon(
			"logo",
			'<path d="M10 90V14.8284C10 13.0466 12.1543 12.1543 13.4142 13.4142L86.5858 86.5858C87.8457 87.8457 90 86.9534 90 85.1716V10" stroke="#FF8A8A" stroke-width="4" stroke-linecap="round"/>'
		);
		const ribbonIconEl = this.addRibbonIcon(
			"logo",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
				console.log("click");
				this.activateView();
				// console.log(`My openai key: ${this.settings.openAiKey}`);
			}
		);
		// todo create and open new view to display the open ai nemesis result
		// it currently does not pop open the view
		this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf));

		// use this class to perform additional things with the ribbon
		// ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText("asdfasdfasdfasdfs");

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Open sample modal (simple)",
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	},
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// get the current text selection in editor and replace it with "Sample Editor Command"
		// this.addCommand({
		// 	id: "sample-editor-command",
		// 	name: "Sample editor command",
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection("Sample Editor Command");
		// 	},
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: NemesisPlugin;

	constructor(app: App, plugin: NemesisPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("OpenAI API Key")
			.setDesc("Set your OpenAI API key here.")
			.addText((text) =>
				text
					.setPlaceholder("Enter OpenAI API key here")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.openAiKey = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
