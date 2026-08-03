import Layout from '@/Layout/index.vue';
export default [
  {
    path: '/treatment-management',
    name: 'treatment-management',
    redirect: '/treatment-management/treatment-monitoring-home',
    meta: {
      title: '治疗管理',
      icon: 'svg_icon_qq',
    },
    component: Layout,
    children: [
      {
        path: 'treatment-monitoring-home',
        name: 'treatment-monitoring-home',
        meta: {
          title: '治疗监控',
          icon: 'Star',
        },
        component: () => import('_v/treatment-management/home.vue'),
      },
      {
        path: 'treatment-detail',
        name: 'treatment-detail',
        meta: {
          title: '治疗详情',
          hideInMenu: true,
        },
        component: () => import('_v/treatment-management/treatment-detail.vue'),
      },
      {
        path: 'patient-module-list',
        name: 'patient-module-list',
        meta: {
          title: '患者管理',
          icon: 'Menu',
        },
        component: () => import('_v/treatment-management/patient-module/pm-list.vue'),
      },
      {
        path: 'device-module-list',
        name: 'device-module-list',
        meta: {
          title: '设备管理',
          icon: 'Menu',
        },
        component: () => import('_v/treatment-management/device-module/dm-list.vue'),
      },
    ]
  },
]
