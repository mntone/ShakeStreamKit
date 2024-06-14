import './styles.css'

import { FC, PropsWithChildren } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

export interface SlideAnimationProps {
	duration?: number
	visible: boolean
}

export const RightSlideAnimation: FC<PropsWithChildren<SlideAnimationProps>> = ({ children, duration = .15, visible }) => {
	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className='SlideAnimation SlideAnimation-right'
					initial={{ transform: 'translateX(100%)' }}
					animate={{ transform: 'none' }}
					exit={{ transform: 'translateX(100%)' }}
					transition={{ duration }}>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export const LeftSlideAnimation: FC<PropsWithChildren<SlideAnimationProps>> = ({ children, duration = .15, visible }) => {
	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className='AnimatedEggGraph SlideAnimation-left'
					initial={{ transform: 'translateX(-100%)' }}
					animate={{ transform: 'none' }}
					exit={{ transform: 'translateX(-100%)' }}
					transition={{ duration }}>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}
