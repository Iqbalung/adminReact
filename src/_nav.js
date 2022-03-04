const bank = {
  component: 'CNavItem',
  name: 'Bank',
  to: '/bank',
  icon: 'cil-chart-pie',
};

// const bank_account = {
//   (this.window.localStorage.getItem('role')== 'admin') ? bank : null;
// };

export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: 'http://128.199.233.113:5601/goto/7442e202fc72428478c410982e9eea30',
    type: 'external-link',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavItem',
    name: 'Bank',
    to: '/bank',
    icon: 'cil-credit-card',
  },
  // {
  //     component: 'CNavTitle',
  //     name: 'Tasks',
  // },
  {
    component: 'CNavItem',
    name: 'Tasks',
    to: '/tasks',
    icon: 'cil-task',
  },

  // {
  //   component: 'CNavTitle',
  //   name: 'Users',
  // },
  {
    component: 'CNavItem',
    name: 'Users',
    to: '/users',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Incidents',
    to: '/incidents',
    icon: 'cil-bell',
  },
  {
    component: 'CNavItem',
    name: 'Debt',
    to: '/debt',
    icon: 'cil-dollar',
  },
  {
    component: 'CNavItem',
    name: 'Log Activity',
    to: '/log',
    icon: 'cil-settings',
  },
  // {
  //   component: 'CNavTitle',
  //   name: 'Theme',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: 'cil-drop',
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: 'cil-pencil',
  // },
  // {
  //   component: 'CNavTitle',
  //   name: 'Components',
  // },
  // {
  //   component: 'CNavGroup',
  //   name: 'Base',
  //   to: '/base',
  //   icon: 'cil-puzzle',
  //   items: [
  //     {
  //       component: 'CNavItem',
  //       name: 'Accordion',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Breadcrumbs',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Cards',
  //       to: '/base/cards',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Carousels',
  //       to: '/base/carousels',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Collapses',
  //       to: '/base/collapses',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'List Groups',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Navs & Tabs',
  //       to: '/base/navs',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Paginations',
  //       to: '/base/paginations',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Placeholders',
  //       to: '/base/placeholders',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Popovers',
  //       to: '/base/popovers',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Progress',
  //       to: '/base/progress',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Spinners',
  //       to: '/base/spinners',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Tables',
  //       to: '/base/tables',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Tooltips',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },

  // {
  //   component: 'CNavItem',
  //   name: 'Download CoreUI',
  //   href: 'http://coreui.io/vue/',
  //   icon: { name: 'cil-cloud-download', class: 'text-white' },
  //   _class: 'bg-success text-white',
  //   target: '_blank'
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Try CoreUI PRO',
  //   href: 'http://coreui.io/pro/vue/',
  //   icon: { name: 'cil-layers', class: 'text-white' },
  //   _class: 'bg-danger text-white',
  //   target: '_blank'
  // }
]
