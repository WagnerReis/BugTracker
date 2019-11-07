const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// configurações
const docId = '1reEYStG87QXMP6GwZT0pVrXtP40nDqXro9OcIszAZi0'
const worksheetIndex = 0

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res('home')
})

app.post('/', (req, res) => {
    const doc = new GoogleSpreadsheet(docId)
    doc.useServiceAccountAuth(credentials, (err) => {
        if (err) {
            console.log('Não foi possivel abrir a planilha')
        } else {
            console.log('Planilha aberta')
            doc.getInfo((err, info) => {
                const worksheet = info.worksheets[worksheetIndex]
                worksheet.addRow({ 
                                   name: req.body.name, 
                                   email: req.body.email,
                                   issueType: req.body.issueType,
                                   howRoReproduce: req.body.howRoReproduce,
                                   expectedOuput: req.body.expectedOuput,
                                   receivedOuput: req.body.receivedOuput
                                 }, err => {
                    res.send('Bug reportado com sucesso!')
                })
            })
        }
    })
})

app.listen(3000, (err) => {
    if(err) {
        console.log('Aconteceu um erro', err)
    } else {
        console.log('BugTracker rodando na porta http://localhost:3000')
    }
})