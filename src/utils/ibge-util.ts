// types
import { IbgeZipcodeResponseProps } from '@/types/common/ibge-types'

export function fetchZipcode(
  zipcode: string,
): Promise<IbgeZipcodeResponseProps | undefined> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!zipcode?.length) {
        console.error(
          'Invalid zipcode received at ibge-util.fetchZipcode function.',
        )
        return resolve(undefined)
      }

      const formattedZipcode = zipcode
        ?.split('-')
        .join('')
        .split(' ')
        .join('')
        .trim()
      if (!formattedZipcode?.length || formattedZipcode?.length < 8) {
        console.error(
          'Invalid zipcode received at ibge-util.fetchZipcode function.',
        )
        return resolve(undefined)
      }

      const result = await fetch(
        `https://viacep.com.br/ws/${formattedZipcode}/json`,
        { method: 'GET' },
      )
      const response = result.ok ? await result.json() : null

      if (!response?.erro) {
        resolve(<IbgeZipcodeResponseProps>{
          city: response.localidade,
          country: 'BR',
          address: response.logradouro,
          complement: response.complemento,
          district: response.bairro,
          uf: response.uf,
          ibge: response.ibge,
          gia: response.gia,
          ddd: response.ddd,
          siafi: response.siafi,
        })
      } else resolve(undefined)
    } catch (err) {
      console.error(
        `Unhandled rejection at ibge-util.fetchZipcode function. Details: ${err}`,
      )
      reject(undefined)
    }
  })
}
