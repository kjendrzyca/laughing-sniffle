import {useState, useCallback} from 'react'

const PROGRAMISTA_15K = 15000

export default function useBalance() {
  const [income, setIncome] = useState(PROGRAMISTA_15K)
  const [additionalIncome, setAdditionalIncome] = useState(0)
  const [expenses, setExpenses] = useState([])

  const setUserData = useCallback(
    ({income, additionalIncome, values}) => {
      setIncome(income)
      setAdditionalIncome(additionalIncome)
      setExpenses(values)
    },
    [setIncome, setAdditionalIncome, setExpenses],
  )

  const balance =
    income +
    additionalIncome -
    expenses.reduce((accu, expense) => accu + expense.howMuch, 0)

  const addExpense = expense => setExpenses([...expenses, expense])

  return {balance, setUserData, addExpense}
}
