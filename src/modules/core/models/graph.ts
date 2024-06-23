import { SVGProps } from 'react'

export interface GraphLayoutProps {
	readonly marginTop: number
	readonly marginLeft: number
	readonly marginRight: number
	readonly marginBottom: number

	readonly width: number
	readonly height: number
	readonly containerWidth?: number | string
	readonly containerHeight?: number | string
}

export type GraphSvgSizeProps =
	& Required<Pick<SVGProps<SVGSVGElement>, 'width' | 'height'>>
	& Pick<SVGProps<SVGSVGElement>, 'preserveAspectRatio' | 'viewBox'>

export function getSvgProps(props: GraphLayoutProps): GraphSvgSizeProps {
	const graphWidth = props.width + props.marginLeft + props.marginRight
	const graphHeight = props.height + props.marginTop + props.marginBottom

	if (!props.containerWidth || !props.containerHeight) {
		return Object.freeze({
			width: graphWidth,
			height: graphHeight,
		})
	}

	return Object.freeze({
		width: props.containerWidth,
		height: props.containerHeight,
		preserveAspectRatio: 'xMinYMax meet',
		viewBox: `0 0 ${graphWidth} ${graphHeight}`,
	})
}
