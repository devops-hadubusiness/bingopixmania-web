export function formatPhoneNumber(phoneNumber: string) {
  const phoneStr = phoneNumber.toString()

  // Extract parts of the phone number
  const countryCode = phoneStr.slice(0, 2)
  const areaCode = phoneStr.slice(2, 4)
  const part1 = phoneStr.slice(4, 8)
  const part2 = phoneStr.slice(8)

  // Combine the parts into the desired format
  return `+${countryCode} (${areaCode}) 9${part1}-${part2}`
}
