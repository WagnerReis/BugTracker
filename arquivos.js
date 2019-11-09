const { readFile, writeFile } = require('./fs-promise')

/*fs.readFile('temporizadores.js', (err, data) => {
    fs.writeFile('temporizadores-copy.js', data, (err) => {
        console.log('Arquivo copiado')
    })
})*/



/*
readFile('temporizadores.js')
    .then( data => writeFile('copia-promise.js', data))
    .then( () => console.log('arquivo copiado'))
    .catch( err => console.log(err))
*/
// async/await

const copyFile = async () => {
    console.log('Ola async/await')
    try {
        const data = await readFile('temporizadores.js')
        await writeFile('copy-async-await.js', data)
        //console.log(String(data))
        console.log('Arquivo lido e escrito')
    } catch (err) {
        console.log('erro', err)
    }

}
copyFile().then(() => console.log('fim do async/await'))