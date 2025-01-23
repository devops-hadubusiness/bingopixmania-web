// packages
import { format } from 'date-fns-tz'
import { parseISO } from 'date-fns'

// constant
import { DATES_PATTERNS } from '@/constants/dates'

// variables
export const timeZone = 'America/Brasilia'

export function formatPTBRDateToUSDate(date: string): string | null {
  try {
    const spt = date.split('/')
    return `${spt[2]}-${spt[1]}-${spt[0]}`
  } catch (err) {
    console.error(err)
    return null
  }
}

export function formatPTBRDateTimeToUSDateTime(datetime: string): string | null {
  try {
    const [date, time] = datetime.split(' ')
    const spt = date.split('/')
    return `${spt[2]}-${spt[1]}-${spt[0]} ${time}`
  } catch (err) {
    console.error(err)
    return null
  }
}

export function formatUSDateTimeToPTBRDateTime(date: string): string | null {
  try {
    const sptH = date.split(' ')
    const sptD = sptH[0].split('-')
    return `${sptD[2]}/${sptD[1]}/${sptD[0]} ${sptH[1]}`
  } catch (err) {
    console.error(err)
    return null
  }
}

export function formatUSDateToPTBRDate(date: string): string | null {
  try {
    const spt = date.split('/')
    return `${spt[1].length == 1 ? '0' + spt[1] : spt[1]}/${spt[0].length == 1 ? '0' + spt[0] : spt[0]}/${spt[2]}`
  } catch (err) {
    console.error(err)
    return null
  }
}

export function formatTimestampToPTBRDatetime(timestamp: string): string | null {
  try {
    if (!timestamp) return '-'
    return timestamp.split('T').join(' ').substring(0, 19)
  } catch (err) {
    console.error(err)
    return null
  }
}

export function formatTimestampToUSDatetime(timestamp: string): string | null {
  try {
    if (!timestamp) return '-'
    return String(timestamp).split('T').join(' ').substring(0, 19)
  } catch (err) {
    console.error(err)
    return null
  }
}

export function formatDateToPTBRDateString(dt: Date): string | null {
  try {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const month = months[dt.getMonth()]
    return `${format(dt, 'dd', { timeZone })} de ${month} de ${format(dt, 'yyyy', { timeZone })}`
  } catch (err) {
    console.error(err)
    return null
  }
}

export function parseDateCategory(date): number {
  if (date.length < 10) return Number(String(date).replace(/\D/g, ''))
  return Date.parse(`${formatPTBRDateToUSDate(date.substr(0, 10))} ${date.substr(13) || '00'}:00:00`)
}

export function formatSpacelessDateToValidDate(spacelessDate: string): string {
  try {
    let str = ''
    let firstPart = ''
    for (const character of spacelessDate) {
      if (character == ' ') continue
      if (!isNaN(Number(character))) break

      if (character === character.toUpperCase()) str += ` ${character}`
      else str += character

      firstPart += character
    }

    const day = spacelessDate.split(firstPart).join('').slice(0, 2)
    str += ` ${day} `

    str += spacelessDate.split(firstPart).join('').slice(2).split('BRT').join(' ')
    return str
  } catch (err) {
    console.error(`Unhandled error at dates-util.formatSpacelessDateToValidDate function. Details: ${err}`)
    return spacelessDate
  }
}

export function formatISOToPTBR(date: string): string {
  if (!date) return ''
  const [year, month, day] = date.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export function formatPTBRToISO(date: string): string {
  const [day, month, year] = date.split('/')
  const isoString = `${year}-${month}-${day}`
  return format(parseISO(isoString), 'yyyy-MM-dd')
}

export function formatISOToPTBRDateTime(dateISO: string): string {
  if (!dateISO) return ''
  const [date, time] = dateISO.split('T')
  const [year, month, day] = date.split('-')
  const formattedTime = time.substring(0, 5)
  return `${day}/${month}/${year} ${formattedTime}`
}

export function formatDateToBR(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatTimestampToPattern(timestamp: string, pattern: string) {
  if (!timestamp || !pattern) return timestamp

  switch (pattern) {
    case DATES_PATTERNS['dd/MM HH:mm'].pattern:
      return DATES_PATTERNS['dd/MM HH:mm'].regex(timestamp)

    default:
      return timestamp
  }
}
