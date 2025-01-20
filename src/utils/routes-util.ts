// packages
import { ShieldOff, LogIn, Search, Dices, Banknote, CircleDollarSign, HandCoins, ReceiptText, Flame, UserRoundPlus, BookOpenText, List, Settings } from 'lucide-react'

// types
import { RouteProps } from '@/types/routes-types'

// entities
import { UserProps, user_role } from '@/entities/user/user'

// pages
import Unauthorized from '@/pages/Unauthorized'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Configs from '@/pages/Configs'
import Turns from '@/pages/Turns'
import Deposit from '@/pages/Deposit'
import Prizes from '@/pages/Prizes'
import Deposits from '@/pages/Deposits'
import Receipts from '@/pages/Receipts'
import Indications from '@/pages/Indications'
import Help from '@/pages/Help'
import SpecialTurns from '@/pages/SpecialTurns'

// store
import { useAuthStore } from '@/store/auth'

export const checkRoutePermission = (user: UserProps | null, roles: user_role[]) => {
  if (user) return roles.includes(user?.role)
  else {
    const storeUser = useAuthStore.getState().user
    return roles.includes(storeUser?.role)
  }
}

export const routes: RouteProps[] = [
  {
    name: '401',
    path: '/401',
    icon: ShieldOff,
    component: Unauthorized,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => false,
    showOnTopbar: () => false
  },
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
    name: 'Sorteio Ao Vivo',
    path: '/sorteio-ao-vivo',
    group: 'Jogos',
    icon: Dices,
    category: 'page',
    component: Home,
    roles: Object.keys(user_role),
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Depositar',
    path: '/depositar',
    icon: Banknote,
    category: 'page',
    component: Deposit,
    roles: Object.keys(user_role),
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => false,
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
    roles: Object.keys(user_role),
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
    roles: Object.keys(user_role),
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
    roles: Object.keys(user_role),
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
    roles: Object.keys(user_role),
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
    roles: Object.keys(user_role),
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
    roles: Object.keys(user_role),
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
    roles: Object.keys(user_role),
    highlight: true,
    button: true,
    disabled: () => false,
    showOnHome: () => false,
    showOnSideDrawer: () => true,
    showOnTopbar: () => false
  },
  {
    name: 'Configurações',
    path: '/configuracoes',
    group: 'Configurações',
    icon: Settings,
    category: 'page',
    component: Configs,
    roles: [user_role.ADMIN, user_role.MODERATOR],
    disabled: () => !checkRoutePermission(null, [user_role.ADMIN, user_role.MODERATOR]),
    showOnHome: () => false,
    showOnSideDrawer: () => checkRoutePermission(null, [user_role.ADMIN, user_role.MODERATOR]),
    showOnTopbar: () => false
  }
]
