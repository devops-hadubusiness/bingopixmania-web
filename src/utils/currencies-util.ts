export function formatBRL(value: number): string | undefined {
  try {
    if (value == null || value == undefined || isNaN(Number(value))) return undefined
    
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
  } catch (err) {
    console.error(err)
    return undefined
  }
}
