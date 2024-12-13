export function removeSpecialCharacters(text: string): string {
  try {
    return String(text)
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  } catch (err) {
    console.error(err)
    return text
  }
}

export function formatToPrice(value: number): string | undefined {
  try {
    if (value == null || value == undefined || isNaN(Number(value)))
      return undefined
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export function capitalizeString(str: string): string {
  const words = str.toLowerCase().split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)
  }

  return words.join(' ')
}

export function capitalizeWords(str) {
  // Capitaliza a primeira letra de cada palavra
  return (
    str
      .replace(/(^|\s)\S/g, function (match) {
        return match.toUpperCase()
      })
      // Capitaliza a primeira letra após cada "-"
      .replace(/-(\w)/g, function (match, p1) {
        return '-' + p1.toUpperCase()
      })
  )
}
