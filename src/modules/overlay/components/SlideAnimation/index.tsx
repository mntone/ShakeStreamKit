import type { PropsWithChildren } from 'react'
import { CSSTransition } from 'react-transition-group'

export interface SlideAnimationProps {
	rich?: boolean
	visible: boolean
}

export const LeftSlideAnimation = ({ children, rich, visible }: PropsWithChildren<SlideAnimationProps>) => {
	const timeout = rich
		? { appear: 300, enter: 167, exit: 168 }
		: 168
	return (
		<CSSTransition
			in={visible}
			classNames='Overlay-left--slide'
			timeout={timeout}
			unmountOnExit={rich}
		>
			{children}
		</CSSTransition>
	)
}

export const RightSlideAnimation = ({ children, rich, visible }: PropsWithChildren<SlideAnimationProps>) => {
	const timeout = rich
		? { appear: 300, enter: 167, exit: 168 }
		: 168
	return (
		<CSSTransition
			in={visible}
			classNames='Overlay-right--slide'
			timeout={timeout}
			unmountOnExit={rich}
		>
			{children}
		</CSSTransition>
	)
}
