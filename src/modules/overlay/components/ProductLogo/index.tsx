import './styles.css'

import { useRef } from 'react'

import { useAppSelector } from 'app/hooks'

import { RightSlideAnimation } from '../SlideAnimation'

const ProductLogo = () => {
	const poweredby = useAppSelector(state => state.overlay.poweredby)
	const ref = useRef<HTMLDivElement>(null)
	return (
		<RightSlideAnimation nodeRef={ref} visible={poweredby}>
			<div className='Overlay Overlay-right ProductLogo' ref={ref}>
				<p className='ProductLogo-poweredby'>Powered By</p>
				<p className='ProductLogo-shake'>Shake</p>
				<p className='ProductLogo-streamkit'>StreamKit</p>
			</div>
		</RightSlideAnimation>
	)
}

export default ProductLogo
