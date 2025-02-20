import * as React from "react";

type ExampleReactViewProps = {
	contents: string[];
};

// todo make text selectable or copyable
export const NemesisRightReactView = ({ contents }: ExampleReactViewProps) => {
	return (
		<div>
			<h1>Hello My Nemesis</h1>
			{contents.map((content, index) => {
				return (
					<div key={index}>
						<p>{content}</p>
					</div>
				);
			})}
		</div>
	);
};
