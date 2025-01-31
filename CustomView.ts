import { ItemView, WorkspaceLeaf } from "obsidian";
// Each view is uniquely identified by a text string
// and several operations require that you specify the view you'd like to use.
// Extracting it to a constant, VIEW_TYPE_EXAMPLE, is a good idea—as you will see later in this guide.
import { Root, createRoot } from "react-dom/client";
import * as React from "react";
import { ExampleReactView } from "./ReactView";

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
	root: Root | null = null;

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
		// const container = this.containerEl.children[1];
		// container.empty();
		// container.createEl("h4", { text: "Example view" });
		this.root = createRoot(this.containerEl.children[1]);
		// this.root.render(<div>asdf</div>);
		// this.root.render(<ExampleReactView />);
		this.root.render(React.createElement(ExampleReactView));
	}

	async onClose() {
		// Nothing to clean up.
		this.root?.unmount();
	}
}
