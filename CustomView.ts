import { ItemView, WorkspaceLeaf } from "obsidian";
// Each view is uniquely identified by a text string
// and several operations require that you specify the view you'd like to use.
// Extracting it to a constant, VIEW_TYPE_EXAMPLE, is a good idea—as you will see later in this guide.

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", { text: "Example view" });
	}

	async onClose() {
		// Nothing to clean up.
	}
}
