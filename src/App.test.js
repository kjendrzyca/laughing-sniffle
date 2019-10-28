import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, wait} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {renderHook} from '@testing-library/react-hooks'

import App, {useBalance} from './App'

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

it('should update balance on click', async () => {
  // given
  const howMuch = 100
  const userData = {income: 15000, additionalIncome: 0, values: []}
  const expectedBalance = userData.income - 100

  const getUserData = jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve(userData))
  const persistExpense = jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve({ok: true}))

  const {getByText, getByLabelText} = render(
    <App getUserData={getUserData} persistExpense={persistExpense} />,
  )

  // when
  userEvent.type(getByLabelText('kwota'), howMuch.toString())
  userEvent.type(getByLabelText('wydatek'), 'test-expense')
  userEvent.type(getByLabelText('kategoria'), 'test-category')
  userEvent.click(getByText('OK'))

  // then
  await wait(() =>
    expect(getByText(expectedBalance.toString())).toBeInTheDocument(),
  )
  await wait(() => expect(persistExpense.mock.calls.length).toBe(1))

  expect(persistExpense.mock.calls[0][0]).toEqual({
    category: 'test-category',
    expense: 'test-expense',
    howMuch,
    fixed: false,
  })
})

it('should start with balance equal to 15000', () => {
  // given
  const {result} = renderHook(() => useBalance())

  // then
  expect(result.current.balance).toEqual(15000)
})
