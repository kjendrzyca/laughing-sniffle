import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import {render, wait} from '@testing-library/react'

import App from './App'

const defaultUserData = {income: 15000, additionalIncome: 0, values: []}

it('should render with 15000 balance initially, regardless of API response', async () => {
  // given
  const expectedBalance = 15000

  // when
  const {getByText} = render(
    <App
      getUserData={jest.fn(() => Promise.resolve(defaultUserData))}
      persistExpense={jest.fn()}
    />,
  )

  // then
  await wait(() =>
    expect(getByText(expectedBalance.toString())).toBeInTheDocument(),
  )
})

it('should calculate balance based on received values', async () => {
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
  const {getByText} = render(
    <App getUserData={getUserData} persistExpense={jest.fn()} />,
  )

  // then
  expect(getUserData.mock.calls.length).toBe(1)
  await wait(() =>
    expect(getByText(expectedBalance.toString())).toBeInTheDocument(),
  )
})

it('should change balance when form is submitted', async () => {
  // given
  const howMuch = 1000
  const expectedBalance = defaultUserData.income - howMuch
  const getUserData = jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve(defaultUserData))
  const persistExpense = jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve({ok: true}))
  const {getByText, getByLabelText} = render(
    <App getUserData={getUserData} persistExpense={persistExpense} />,
  )

  // when
  userEvent.type(getByLabelText('kwota'), howMuch.toString())
  userEvent.type(getByLabelText('wydatek'), 'testing-expense')
  userEvent.type(getByLabelText('kategoria'), 'testing-category')
  userEvent.click(getByText('OK'))

  // then
  await wait(() =>
    expect(getByText(expectedBalance.toString())).toBeInTheDocument(),
  )
})

it('should send expense to backend on submit', async () => {
  // given
  const howMuch = 1000
  const getUserData = jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve(defaultUserData))
  const persistExpense = jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve({ok: true}))
  const {getByText, getByLabelText} = render(
    <App getUserData={getUserData} persistExpense={persistExpense} />,
  )

  // when
  userEvent.type(getByLabelText('kwota'), howMuch.toString())
  userEvent.type(getByLabelText('wydatek'), 'testing-expense')
  userEvent.type(getByLabelText('kategoria'), 'testing-category')
  userEvent.click(getByText('OK'))

  // then
  await wait(() => expect(persistExpense.mock.calls.length).toBe(1))

  expect(persistExpense.mock.calls[0][0]).toEqual({
    category: 'testing-category',
    expense: 'testing-expense',
    howMuch,
    fixed: false,
  })
})
