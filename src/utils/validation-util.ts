import { z } from 'zod'

export const cpfMask = (value: string): string => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const cnpjMask = (value: string): string => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const phoneMask = (value: string): string => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})/, '$1 - $2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

export const cepMask = (value: string): string => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{5})(\d{3})/, '$1 - $2')
    .replace(/(-\d{3})\d+?$/, '$1')
}

export const currencyMask = (value: string): string => {
  const numericValue = value.replace(/\D+/g, '') // Remove tudo que não for dígito
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(parseFloat(numericValue) / 100) // Divide por 100 para ajustar os centavos
  return formattedValue
}

export const validationSchema = z.object({
  cpfCnpj: z
    .string()
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '')
      return replacedDoc.length >= 11
    }, 'CPF/CNPJ deve conter no mínimo 11 caracteres.')
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '')
      return replacedDoc.length <= 14
    }, 'CPF/CNPJ deve conter no máximo 14 caracteres.')
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '')
      return !!Number(replacedDoc)
    }, 'CPF/CNPJ deve conter apenas números.'),
  phone: z.string().refine((phone) => {
    const replacedPhone = phone.replace(/\D/g, '')
    return replacedPhone.length === 11
  }, 'Telefone deve conter 11 caracteres.'),
  zipcode: z.string().refine((cep) => {
    const replacedCep = cep.replace(/\D/g, '')
    return replacedCep.length === 8
  }, 'CEP deve conter 8 caracteres.'),
})
