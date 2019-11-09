const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// configurações
const docId = '1reEYStG87QXMP6GwZT0pVrXtP40nDqXro9OcIszAZi0'
const worksheetIndex = 0
const sendGridKey = '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'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/', async (req, res) => {
    try {
        const doc = new GoogleSpreadsheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
            name: req.body.name,
            email: req.body.email,
            issueType: req.body.issueType,
            source: req.query.source || 'direct',
            howRoReproduce: req.body.howRoReproduce,
            expectedOuput: req.body.expectedOuput,
            receivedOuput: req.body.receivedOuput,
            userAgent: req.body.userAgent,
            userDate: req.body.userDate
        })

        // se for critico
        if (req.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey);
            const msg = {
                to: 'wagnersilva1997@hotmail.com',
                from: 'wagnersilva1997@hotmail.com',
                subject: 'BUG Critico reportado',
                text: `
                    O usuário ${req.body.name} reportou um problema.
                `,
                html: `O usuário ${req.body.name} reportou um problema.`,
            }
            sgMail.send(msg);
        }

        res.render('sucesso')
    } catch (err) {
        res.send('Erro ao enviar formulário.')
        console.log(err)
    }
})



app.listen(3000, (err) => {
    if (err) {
        console.log('Aconteceu um erro', err)
    } else {
        console.log('BugTracker rodando na porta http://localhost:3000')
    }
})