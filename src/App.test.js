import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'

import App from './App'

it('should render with 15000 balance initially, regardless of API response', async () => {
  // given
  const expectedBalance = 15000

  // when
  const {getByText} = render(<App />)

  // then
  expect(getByText(expectedBalance.toString())).toBeInTheDocument()
})
