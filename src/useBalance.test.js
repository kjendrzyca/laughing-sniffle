import '@testing-library/jest-dom/extend-expect'
import {renderHook, act} from '@testing-library/react-hooks'

import useBalance from './useBalance'

it('should start with balance equal to 15000', () => {
  // given
  const {result} = renderHook(() => useBalance())

  // then
  expect(result.current.balance).toEqual(15000)
})

it('should calculate balance when given userData', () => {
  // given
  const {result} = renderHook(() => useBalance())
  const expectedBalance = 14950

  // when
  act(() => {
    result.current.setUserData({
      additionalIncome: 50,
      income: 15000,
      values: [{howMuch: 100}],
    })
  })

  // then
  expect(result.current.balance).toEqual(expectedBalance)
})

it('should recalculate balance correctly when new expense is added', () => {
  // given
  const {result} = renderHook(() => useBalance())
  const expectedBalance = 14850

  act(() => {
    result.current.setUserData({
      additionalIncome: 50,
      income: 15000,
      values: [{howMuch: 100}],
    })
  })

  // when
  act(() => {
    result.current.addExpense({howMuch: 100})
  })

  // then
  expect(result.current.balance).toEqual(expectedBalance)
})
