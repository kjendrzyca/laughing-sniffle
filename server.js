const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')

const {authentication, googleSpreadsheets} = require('tarnas-utils')

const googleAuth = authentication({
  id: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_SECRET,
  devRedirect: 'http://localhost:3000/',
})

const PROGRAMISTA_15K = 15000

const getSheet = googleSpreadsheets({
  spreadsheetName: 'qe-real-deal',
  values: [
    {
      key: 'income',
      label: 'przychód',
      initialValue: PROGRAMISTA_15K,
      format: Number,
    },
    {
      key: 'additionalIncome',
      label: 'dodatkowy przychód',
      initialValue: 0,
      format: Number,
    },
  ],
  tableHeader: [
    {key: 'expense', label: 'przychód'},
    {key: 'category', label: 'kategoria'},
    {key: 'howMuch', label: 'kwota', format: Number},
    {
      key: 'fixed',
      label: 'powtarza się',
      format: googleValue => googleValue.formattedValue === 'TRUE',
    },
  ],
})

const PORT = process.env.PORT || 3001
const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use('/static', express.static(path.join(__dirname, './build/static')))

app.use(session({secret: 'yup Im cheating but cant type this fast'}))

googleAuth.setup(app)

app.get('/', (_req, res) =>
  res.sendFile(path.join(__dirname, 'build', 'index.html')),
)

const getSheetByKey = getKey => async (req, res, next) => {
  const sheetKey = getKey(req)

  req.sheet = await getSheet({
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
    sheetKey,
    accessToken: req.user.accessToken,
  })

  next()
}

app.get(
  '/api/userData',
  getSheetByKey(req => req.query.when),
  async (req, res) => {
    return res.json(await req.sheet.getAllData())
  },
)

app.post(
  '/api/expenses',
  getSheetByKey(req => req.body.when),
  async (req, res) => {
    const {expense} = req.body

    return res.json(await req.sheet.append(expense))
  },
)

googleAuth.routes(app)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
