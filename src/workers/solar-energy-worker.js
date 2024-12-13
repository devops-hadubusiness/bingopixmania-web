// variables
var dataRead = '',
  count = 1

  console.log('aq1')
onmessage = ({ data }) => {
  console.log('aq2')
  _processFile(data)
}

function _processFile({ file, last, size }) {
  try {
    file
      .stream()
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(_readChunk({ size }))
      .pipeTo(
        new WritableStream({
          write() { },
          async close() {
            try {
              const sheetData = dataRead.substring(dataRead.indexOf('<sheetData>') + '<sheetData>'.length, dataRead.indexOf('</sheetData>'))
              const rows = sheetData.split('<row').filter(r => !!r && r.includes('<c'))
              // console.log(rows)
              let rowNumber, headers = [], cells = [], fixedCells = [], cellName, values = [], valueContent, result = [], cellLetter, cellCurrentIndex
              for (let row of rows) {
                rowNumber = row.substring(row.indexOf('r=\"') + 'r=\"'.length)
                rowNumber = rowNumber.substring(0, rowNumber.indexOf('\"'))
                // console.log(rowNumber)

                cells = row.split('<c').filter(c => c.includes('<v>'))
                fixedCells = []
                cellCurrentIndex = 0

                for (let cell of cells) {
                  cellLetter = String.fromCharCode(65 + cellCurrentIndex)
                  if (cell.substring(cell.indexOf('="') + '="'.length, cell.indexOf('="') + '="'.length + 1) != cellLetter) {
                    if (rows.indexOf(row) == 1) console.warn('PULOU: ', String.fromCharCode(65 + cellCurrentIndex))

                    fixedCells.push(`r="${String.fromCharCode(65 + cellCurrentIndex)}${rows.indexOf(row) + 1}" t="str"><v></v></c>`)
                    cellCurrentIndex++
                  }

                  cellCurrentIndex++
                  fixedCells.push(cell)
                }

                if (rows.indexOf(row) == 1) console.log(fixedCells)

                if (rows.indexOf(row) != 0) result.push({})

                for (let cell of fixedCells) {
                  // console.log(cellLetter, cell.substring(cell.indexOf('="') + '="'.length, cell.indexOf('="') + '="'.length + 1))

                  cellName = cell.substring(cell.indexOf('r=\"') + 'r=\"'.length)
                  cellName = cellName.substring(0, cellName.indexOf('\"'))
                  // console.log(cellName)

                  values = cell.split('<v>').filter(c => c.includes('</v>'))

                  // console.warn(values)
                  // if(rows.indexOf(row) < 2)console.log(values)

                  for (let value of values) {
                    valueContent = value.substring(0, value.indexOf('</v>'))
                    // if(rows.indexOf(row) == 0) console.log(valueContent)

                    if (rows.indexOf(row) == 0) headers.push(valueContent)
                    else result.at(-1)[headers.at(fixedCells.indexOf(cell))] = valueContent || ''
                  }
                }
              }

              postMessage({ eventType: 'done', parsedData: result })

              if (last) {
                dataRead = ''
                count = 1
              }
            } catch (e) {
              console.error(`Unhandled error at solar-energy-worker._processFile.close function. Details: ${e}`)
            }
          }
        })
      )
  } catch (err) {
    console.error(`Unhandled error at solar-energy-worker._processFile function. Details: ${err}`)
  }
}

// função que faz o parse do excel utilizando as próprias colunas para montar um objeto JSON, e o retorna.
function _readChunk({ size }) {
  try {
    let totalUploaded = 0,
      progress = 0

    return new TransformStream({
      async transform(chunk, controller) {
        dataRead += chunk
        totalUploaded = dataRead.length
        progress = Number(Number((100 / size) * totalUploaded).toFixed(2))
        setTimeout(() => postMessage({ eventType: 'updateUploadProgress', progress }), count * 250)
        count++
        return
      }
    })
  } catch (err) {
    console.error(`Unhandled error at solar-energy-worker._readChunk function. Details: ${err}`)
  }
}

function _formatCpf(cpf) {
  try {
    const pattern = /(\d{3})(\d{3})(\d{3})(\d{2})/
    const formattedCpf = cpf?.replace(pattern, (regex, arg1, arg2, arg3, arg4) => `${arg1}.${arg2}.${arg3}-${arg4}`)
    return formattedCpf
  } catch (err) {
    console.error(`Unhandled error at solar-energy-worker._formatCpf function. Details: ${err}`)
    return cpf
  }
}

function _formatCnpj(cnpj) {
  try {
    const pattern = /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/
    const formattedCnpj = cnpj?.replace(pattern, (regex, arg1, arg2, arg3, arg4, arg5) => `${arg1}.${arg2}.${arg3}/${arg4}-${arg5}`)
    return formattedCnpj
  } catch (err) {
    console.error(`Unhandled error at solar-energy-worker._formatCnpj function. Details: ${err}`)
    return cnpj
  }
}

function _formatString(string) {
  try {
    return string?.split(`'`).join('').split('`').join('').split('"').join('').trim()
  } catch (err) {
    console.error(`Unhandled error at solar-energy-worker._formatString function. Details: ${err}`)
    return string
  }
}