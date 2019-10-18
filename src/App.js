import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import './App.css'
import {Message, Button, Form, Label, Segment, Grid} from 'semantic-ui-react'
import * as Yup from 'yup'
import {Formik} from 'formik'

const {Input, Field, Checkbox} = Form

const CATEGORIES = ['jedzenie', 'samochód', 'inne', 'firma', 'mieszkanie']

const {Row, Column} = Grid

const PROGRAMISTA_15K = 15000

const renderError = (touched, error) =>
  touched ? Boolean(error) && <Message color="red">{error}</Message> : null

const renderMonth = () => {
  return new Date().toLocaleDateString('pl-PL', {month: 'long'})
}

const App = ({persistExpense, getUserData}) => {
  const [income, setIncome] = useState(PROGRAMISTA_15K)
  const [additionalIncome, setAdditionalIncome] = useState(0)
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    getUserData().then(userData => {
      setIncome(userData.income)
      setAdditionalIncome(userData.additionalIncome)
      setExpenses(userData.values)
    })
  }, [])

  const renderBalance = () => {
    const balance =
      income +
      additionalIncome -
      expenses.reduce((accu, expense) => accu + expense.howMuch, 0)

    return (
      <Label color="green" size="huge">
        {balance}
      </Label>
    )
  }

  const renderForm = () => {
    return (
      <Formik
        initialValues={{expense: '', howMuch: 0, category: '', fixed: false}}
        onSubmit={async (values, {setSubmitting, resetForm}) => {
          setSubmitting(true)

          const {errors} = await persistExpense(values)

          if (errors && errors.length) {
            // TODO
            return
          }

          setExpenses([...expenses, values])
          setSubmitting(false)
          resetForm()
        }}
        validationSchema={Yup.object().shape({
          category: Yup.string().required('kategoria jest potrzebna'),
          expense: Yup.string().required('wydatek jest ważny'),
          howMuch: Yup.number().min(0.01, 'nic nie kosztuje 0zł ;('),
        })}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          errors,
          touched,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Input
              error={Boolean(touched.howMuch && errors.howMuch)}
              fluid
              id="howMuch"
              label="kwota"
              onChange={handleChange}
              placeholder="kwota"
              required
              step={0.01}
              type="number"
              value={values.howMuch}
            />
            {renderError(touched.howMuch, errors.howMuch)}
            <Input
              error={Boolean(touched.expense && errors.expense)}
              fluid
              id="expense"
              label="wydatek"
              onChange={handleChange}
              placeholder="wydatek"
              required
              value={values.expense}
            />
            {renderError(touched.expense, errors.expense)}
            <Input
              error={Boolean(touched.category && errors.category)}
              fluid
              id="category"
              label="kategoria"
              list="categories"
              onChange={handleChange}
              placeholder="kategoria"
              required
              value={values.category}
            />
            {renderError(touched.category, errors.category)}
            <datalist id="categories">
              {CATEGORIES.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
            <Field>
              <Checkbox
                checked={values.fixed}
                label="powtarza się"
                onChange={(e, {checked}) => setFieldValue('fixed', checked)}
              />
            </Field>
            <Field>
              <Button
                disabled={isSubmitting}
                fluid
                positive
                size="huge"
                type="submit"
              >
                OK
              </Button>
            </Field>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <main className="App">
      <Grid container>
        <Row textAlign="center">
          <Column>
            <Segment vertical>{renderBalance()}</Segment>
            <Segment vertical>{renderMonth()}</Segment>
          </Column>
        </Row>
        <Row>
          <Column>{renderForm()}</Column>
        </Row>
      </Grid>
    </main>
  )
}

App.propTypes = {
  getUserData: PropTypes.func.isRequired,
  persistExpense: PropTypes.func.isRequired,
}

export default App
