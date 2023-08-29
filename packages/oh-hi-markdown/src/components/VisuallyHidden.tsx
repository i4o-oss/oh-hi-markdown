import { ReactNode } from 'react'

const VisuallyHidden = ({ children }: { children: ReactNode }) => (
	<span className='!ohm-absolute ohm-h-px ohm-w-px ohm-overflow-hidden'></span>
)

export default VisuallyHidden
