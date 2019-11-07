const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

const doc = new GoogleSpreadsheet('1reEYStG87QXMP6GwZT0pVrXtP40nDqXro9OcIszAZi0')
doc.useServiceAccountAuth(credentials, (err) => {
    if( err ) {
        console.log('Não foi possivel abrir a planilha')
    } else {
        console.log('Planilha aberta')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'Wagner', email: 'test'}, err => {
                console.log('Linha inserida')
            })
        })
    }
})