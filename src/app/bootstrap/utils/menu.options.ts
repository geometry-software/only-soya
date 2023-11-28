import { AuthStatus } from 'src/app/auth/utils/auth.model'

interface MenuOption {
  title?: string
  icon?: string
  link?: string
  roles: Array<AuthStatus>
}

export const userMenuOptions: Array<MenuOption> = [
  {
    title: 'Menu',
    icon: 'menu_book',
    link: 'cafe/menu',
    roles: ['cafe'],
  },
  {
    title: 'Orders',
    icon: 'playlist_add_check',
    link: 'cafe/orders',
    roles: ['cafe'],
  },
  {
    title: 'Login',
    icon: 'app_settings_alt',
    link: 'login/',
    roles: ['cafe', 'customer', 'admin'],
  },
  {
    title: 'Users',
    icon: 'group',
    link: 'login/users',
    roles: ['cafe', 'customer'],
  },
  {
    title: 'Menu',
    icon: 'menu_book',
    link: 'vegi/menu',
    roles: ['customer', 'cafe'],
  },
  {
    title: 'Orders',
    icon: 'playlist_add_check',
    link: 'vegi/orders',
    roles: ['customer'],
  },
  {
    title: 'Payments',
    icon: 'sort',
    link: 'vegi/payments',
    roles: ['customer', 'admin'],
  },
]
