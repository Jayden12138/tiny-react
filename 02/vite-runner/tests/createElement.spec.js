import React from '../core/React.js'
import { describe, it, expect } from 'vitest'

describe('createElement', () => {
	it('should return vdom for element', () => {
		const el = React.createElement('div', { id: 'root' }, 'hello world!')

		expect(el).toEqual({
			type: 'div',
			props: {
				id: 'root',
				children: [
					{
						type: 'TEXT_ELEMENT',
						props: {
							nodeValue: 'hello world!',
							children: [],
						},
					},
				],
			},
		})
	})
})
