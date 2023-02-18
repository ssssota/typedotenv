type Props = {
	size: string | number;
};

export function Npm({ size }: Props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 27.23 27.23"
			width={size}
			height={size}
		>
			<rect fill="#333333" width="27.23" height="27.23" rx="2" />
			<polygon
				fill="#fff"
				points="5.8 21.75 13.66 21.75 13.67 9.98 17.59 9.98 17.58 21.76 21.51 21.76 21.52 6.06 5.82 6.04 5.8 21.75"
			/>
		</svg>
	);
}
