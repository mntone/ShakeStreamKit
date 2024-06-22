import { SVGProps } from 'react'

export interface GraphSizeProps {
	readonly graphWidth: number
	readonly graphHeight: number
	readonly containerWidth?: number | string
	readonly containerHeight?: number | string
}

export interface GraphLayoutProps extends GraphSizeProps {
	readonly marginTop: number
	readonly marginLeft: number
	readonly marginRight: number
	readonly marginBottom: number
}

export type GraphSvgSizeProps =
	& Required<Pick<SVGProps<SVGSVGElement>, 'width' | 'height'>>
	& Pick<SVGProps<SVGSVGElement>, 'preserveAspectRatio' | 'viewBox'>

export function getSvgProps(props: GraphSizeProps): GraphSvgSizeProps {
	if (!props.containerWidth || !props.containerHeight) {
		return Object.freeze({
			width: props.graphWidth,
			height: props.graphHeight,
		})
	}

	return Object.freeze({
		width: props.containerWidth,
		height: props.containerHeight,
		preserveAspectRatio: 'xMinYMax meet',
		viewBox: `0 0 ${props.graphWidth} ${props.graphHeight}`,
	})
}
