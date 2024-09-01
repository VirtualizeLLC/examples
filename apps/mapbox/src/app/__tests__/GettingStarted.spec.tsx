import * as React from 'react'
import { render } from '@testing-library/react-native'

import GettingStarted from '../GettingStarted'

test('renders correctly', () => {
  const { getByTestId } = render(<GettingStarted />)
  expect(getByTestId('heading')).toHaveTextContent('Welcome')
})
