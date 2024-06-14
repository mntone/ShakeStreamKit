import { FC } from 'react'

import { CheckIcon } from '@heroicons/react/16/solid'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import './styles.css'

const CheckBox: FC<CheckboxPrimitive.CheckboxProps> = ({ children, ...props }) => {
	return (
		<div className='CheckBox'>
			<CheckboxPrimitive.Root
				className='CheckBox-mark'
				{...props}
			>
				<CheckboxPrimitive.CheckboxIndicator className='CheckBox-icon'>
					<CheckIcon className='Icon16' />
				</CheckboxPrimitive.CheckboxIndicator>
			</CheckboxPrimitive.Root>

			<label
				className='CheckBox-label'
				htmlFor={props.id}
			>
				{children}
			</label>
		</div>
	)
}

export default CheckBox
