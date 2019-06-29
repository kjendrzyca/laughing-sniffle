const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')

const {authentication} = require('tarnas-utils')

const googleAuth = authentication({
  id: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_SECRET,
  devRedirect: 'http://localhost:3000/',
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

googleAuth.routes(app)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
