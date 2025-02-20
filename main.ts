import { ExampleView, VIEW_TYPE_EXAMPLE } from "CustomView";
import {
	addIcon,
	App,
	Notice,
	Plugin,
	PluginSettingTab,
	requestUrl,
	Setting,
	WorkspaceLeaf,
} from "obsidian";

interface PluginSettings {
	openAiKey: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
	openAiKey: "",
};

export default class NemesisPlugin extends Plugin {
	settings: PluginSettings;

	async testFunction() {
		const activeFile = this.app.workspace.getActiveFile();
		// console.log('activeFile')
		// console.log(activeFile)
		if (!activeFile) return null;

		const fileContent = await this.app.vault.read(activeFile);
		// console.log(fileContent)
		const nemesisPrompt = `You are a friendly but challenging intellectual nemesis. 
		Review the following content and respond with:
		1. Point out potential logical flaws or assumptions
		2. Suggest alternative perspectives
		3. Ask thought-provoking questions that challenge the main ideas
		4. Provide constructive criticism while maintaining a supportive tone

		End each section with a <section-done>. Keep it short.
		Here's the content to analyze:
		${fileContent}`;

		try {
			// use Obsidian requestUrl API to avoid CORS issues
			const response = await requestUrl({
				url: "https://api.openai.com/v1/chat/completions",
				method: "POST",
				headers: {
					Authorization: `Bearer ${this.settings.openAiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "gpt-3.5-turbo",
					messages: [{ role: "user", content: nemesisPrompt }],
				}),
			});

			const data = await response.json;

			if (response.status !== 200) {
				throw new Error(data.error?.message || "API request failed");
			}
			const aiResponse = data.choices[0].message.content;

			// const aiResponse = `1. The statement "Billionaires could've stopped sooner, but they didn't, because there's nothing else they wish to do" assumes that billionaires continue to build their companies solely out of interest and not for other reasons such as maintaining power or increasing wealth. It could be argued that there are various motivations for billionaires to continue building their projects beyond just genuine interest.
			// <section-done>

			// 2. An alternative perspective could be that while YC does emphasize making something people want and understanding user needs, the process of becoming a billionaire involves more factors than just user satisfaction. Factors like market demand, competition, innovation, timing, and luck also play a significant role in achieving billionaire status.
			// <section-done>

			// 3. How do we define what users want? Is it always a straightforward process to understand and meet user needs, especially in a fast-changing market? Are there instances where companies have succeeded without prioritizing user desires above all else?
			// <section-done>

			// 4. The article discusses the importance of understanding user needs and building products based on that understanding. It would be beneficial to also explore the potential drawbacks of solely focusing on user feedback and the risks of ignoring broader market trends or innovations.
			// <section-done>
			// `;

			// update the leaf with new response
			const leaves =
				this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);
			// if the view exists, update the content
			if (leaves.length > 0) {
				const view = leaves[0].view as ExampleView;
				view.updateContent(aiResponse);
			}
		} catch (error) {
			new Notice("OpenAI Error: " + error.message);
			console.error("OpenAI Error:", error);
		}
	}

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
		if (leaf) {
			workspace.revealLeaf(leaf);
			workspace.setActiveLeaf(leaf);
		}
	}

	async onload() {
		await this.loadSettings();

		console.log("loading plugin");

		// This creates an icon in the left ribbon.
		addIcon(
			"nemesisLogo",
			'<path d="M10 90V14.8284C10 13.0466 12.1543 12.1543 13.4142 13.4142L86.5858 86.5858C87.8457 87.8457 90 86.9534 90 85.1716V10" stroke="#FF8A8A" stroke-width="4" stroke-linecap="round"/>'
		);
		const ribbonIconEl = this.addRibbonIcon(
			"nemesisLogo",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("Generating response!");
				// console.log("click");
				this.activateView();
				this.testFunction();
				// console.log(`My openai key: ${this.settings.openAiKey}`);
			}
		);
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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new NemesisSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );
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

class NemesisSettingTab extends PluginSettingTab {
	plugin: NemesisPlugin;

	constructor(app: App, plugin: NemesisPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("OpenAI API Key")
			.setDesc("Set your OpenAI API key here.")
			.addText((text) =>
				text
					.setPlaceholder("Enter OpenAI API key here")
					.setValue(this.plugin.settings.openAiKey)
					.onChange(async (value) => {
						this.plugin.settings.openAiKey = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
