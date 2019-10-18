const getKey = () => {
  const now = new Date()

  return `${now.getFullYear()}-${now.getMonth() + 1}` // js things
}

export const getUserData = () =>
  fetch(`/api/userData?when=${getKey()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())

export const persistExpense = expense =>
  fetch('/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      when: getKey(),
      expense,
    }),
  }).then(res => res.json())
