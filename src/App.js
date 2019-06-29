import React, {Component} from 'react'
import './App.css'
import {Button, Form, Label, Segment, Grid} from 'semantic-ui-react'
import {Formik} from 'formik'

const {Input, Field, Checkbox} = Form

const CATEGORIES = ['jedzenie', 'samochód', 'inne', 'firma', 'mieszkanie']

const {Row, Column} = Grid

const PROGRAMISTA_15K = 15000

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  renderBalance = () => {
    const balance = PROGRAMISTA_15K

    return (
      <Label color="green" size="huge">
        {balance}
      </Label>
    )
  }

  renderMonth = () => {
    return new Date().toLocaleDateString('pl-PL', {month: 'long'})
  }

  renderForm = () => {
    return (
      <Formik
        initialValues={{expense: '', howMuch: 0, category: '', fixed: false}}
        onSubmit={(values, {setSubmitting, resetForm}) => {
          resetForm()
        }}
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
              error={Boolean(false)}
              fluid
              id="expense"
              label="wydatek"
              onChange={handleChange}
              placeholder="wydatek"
              required
              value={values.expense}
            />
            <Input
              error={Boolean(false)}
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
            <Input
              error={Boolean(false)}
              fluid
              id="category"
              label="kategoria"
              list="categories"
              onChange={handleChange}
              placeholder="kategoria"
              required
              value={values.category}
            />
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
                fluid
                disabled={isSubmitting}
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

  render() {
    return (
      <main className="App">
        <Grid container>
          <Row textAlign="center">
            <Column>
              <Segment vertical>{this.renderBalance()}</Segment>
              <Segment vertical>{this.renderMonth()}</Segment>
            </Column>
          </Row>
          <Row>
            <Column>{this.renderForm()}</Column>
          </Row>
        </Grid>
      </main>
    )
  }
}

export default App
