export function parsePhoneNumber(telephones: string, index : string | number) {
  try {
    const phoneArray = telephones ? JSON.parse(telephones) : []
    return phoneArray[index] || ''
  } catch (err) {
    console.error(`Error parsing phone numbers: ${err}`)
    return ''
  }
}

export function parseEmail(emails: string, index: string | number) {
  try {
    const emailArray = emails ? JSON.parse(emails) : []
    return emailArray[index] || ''
  } catch (err) {
    console.error(`Error parsing emails: ${err}`)
    return ''
  }
}

export function parseJSON(jsonString: string): any[] {
  try {
    const parsed = JSON.parse(jsonString)
    return Array.isArray(parsed) ? parsed : Object.values(parsed)
  } catch (error) {
    console.error('Error parsing JSON string:', error)
    return []
  }
}
