// packages
import { z } from 'zod'

// entities
import { Company } from '../company/company'
import { User } from '../user/user'

// types
export type CompanyUserProps = {
  companyId: number
  userId: number
  favorite: boolean

  // relationships
  company?: Company
  user?: User
}

export class CompanyUser {
  private props: CompanyUserProps

  get companyId() {
    return this.props.companyId
  }

  get userId() {
    return this.props.userId
  }

  get favorite() {
    return this.props.favorite
  }

  get company() {
    return this.props.company
  }

  get user() {
    return this.props.user
  }

  constructor(props: CompanyUserProps) {
    this.props = props
  }
}
