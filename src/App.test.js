import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, wait} from '@testing-library/react'

import App from './App'

it('should render with 15000 balance initially, regardless of API response', async () => {
  // given
  const expectedBalance = 15000

  // when
  const {getByText} = render(
    <App
      getUserData={jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({income: 0, additionalIncome: 0, values: []}),
        )}
    />,
  )

  // then
  expect(getByText(expectedBalance.toString())).toBeInTheDocument()
})

it('should show balance based on api response', async () => {
  // given
  const expectedBalance = 14950
  const getUserData = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      additionalIncome: 50,
      income: 15000,
      values: [{howMuch: 100}],
    }),
  )

  // when
  const {getByText} = render(<App getUserData={getUserData} />)

  // then
  expect(getUserData.mock.calls.length).toBe(1)
  await wait(() =>
    expect(getByText(expectedBalance.toString())).toBeInTheDocument(),
  )
})
