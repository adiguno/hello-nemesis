import * as React from "react";

type ExampleReactViewProps = {
	contents: string[]
}

export const ExampleReactView = ({ contents }: ExampleReactViewProps) => {
	return (

		<div>
			<h1>Hello My Nemesis</h1>
			{contents.map((content, index) => {
				return (<><div key={index}>{content}</div><br /></>)
			})}
		</div>

	)
};
