// packages
import { LogIn, Search, Dices, Banknote, CircleDollarSign, HandCoins, ReceiptText, Flame, UserRoundPlus, BookOpenText, List } from 'lucide-react'

// types
import { RouteProps } from '@/types/routes-types'

// pages
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Turns from '@/pages/Turns'
import Deposit from '@/pages/Deposit'
import Prizes from '@/pages/Prizes'
import Deposits from '@/pages/Deposits'
import Receipts from '@/pages/Receipts'
import Indications from '@/pages/Indications'
import Help from '@/pages/Help'
import SpecialTurns from '@/pages/SpecialTurns'

export const routes: RouteProps[] = [
  {
    name: '404',
    path: '/404',
    icon: Search,
    component: NotFound,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => false,
    showOnTopbar: () => false
  },
  {
    name: 'Login',
    path: '/',
    icon: LogIn,
    component: Login,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => false,
    showOnTopbar: () => false
  },
  {
    name: 'Login',
    path: '/login',
    icon: LogIn,
    component: Login,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => false,
    showOnTopbar: () => false
  },
  {
    name: 'Depositar',
    path: '/depositar',
    icon: Banknote,
    category: 'page',
    component: Deposit,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => false,
    showOnTopbar: () => false
  },
  {
    name: 'Sorteio Ao Vivo',
    path: '/home',
    group: 'Jogos',
    icon: Dices,
    category: 'page',
    component: Home,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Rodadas',
    path: '/rodadas',
    group: 'Jogos',
    icon: List,
    description: ``,
    category: 'page',
    component: Turns,
    disabled: () => false,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Meus Prêmios',
    path: '/premiso',
    group: 'Controle',
    icon: CircleDollarSign,
    description: ``,
    category: 'page',
    component: Prizes,
    disabled: () => false,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Minhas Recargas',
    path: '/depositos',
    group: 'Controle',
    icon: HandCoins,
    description: ``,
    category: 'page',
    component: Deposits,
    disabled: () => false,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Meu Extrato',
    path: '/extrato',
    group: 'Controle',
    icon: ReceiptText,
    description: ``,
    category: 'page',
    component: Receipts,
    disabled: () => false,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Indicar Amigo',
    path: '/indicacoes',
    group: 'Bônus',
    icon: UserRoundPlus,
    description: ``,
    category: 'page',
    component: Indications,
    disabled: () => false,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Ajuda',
    path: '/ajuda',
    group: 'FAQ',
    icon: BookOpenText,
    description: ``,
    category: 'page',
    component: Help,
    disabled: () => false,
    showOnHome: () => true,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Rodadas Especiais',
    path: '/rodadas-especiais',
    group: 'Jogos',
    icon: Flame,
    category: 'page',
    component: SpecialTurns,
    highlight: true,
    button: true,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  }
]
