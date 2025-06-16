import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Importar vistas principales
const HomeView = () => import('../views/HomeView.vue')
const LoginView = () => import('../views/auth/LoginView.vue')
const RegisterView = () => import('../views/auth/RegisterView.vue')
const DashboardView = () => import('../views/DashboardView.vue')

// Vistas de Cliente
const ClientPetsView = () => import('../views/client/PetsView.vue')
const ClientAppointmentsView = () => import('../views/client/AppointmentsView.vue')
const ClientPetDetailView = () => import('../views/client/PetDetailView.vue')
const ClientMedicalHistoryView = () => import('../views/client/MedicalHistoryView.vue')
const ClientNewAppointmentView = () => import('../views/client/NewAppointmentView.vue')

// Vistas de Veterinario
const VetDashboardView = () => import('../views/vet/DashboardView.vue')
const VetPatientsView = () => import('../views/vet/PatientsView.vue')
const VetPatientDetailView = () => import('../views/vet/PatientDetailView.vue')
const VetAppointmentsView = () => import('../views/vet/AppointmentsView.vue')
const VetScheduleView = () => import('../views/vet/ScheduleView.vue')
const VetMedicalRecordsView = () => import('../views/vet/MedicalRecordsView.vue')

// Vistas Compartidas
const ProfileView = () => import('../views/ProfileView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },

  // === RUTAS PARA CLIENTES ===
  {
    path: '/client',
    redirect: '/client/pets'
  },
  {
    path: '/client/pets',
    name: 'client-pets',
    component: ClientPetsView,
    meta: { requiresAuth: true, roles: ['CLIENT'] }
  },
  {
    path: '/client/pets/:id',
    name: 'client-pet-detail',
    component: ClientPetDetailView,
    meta: { requiresAuth: true, roles: ['CLIENT'] },
    props: true
  },
  {
    path: '/client/pets/:id/edit',
    name: 'client-pet-edit',
    component: () => import('../views/client/PetEditView.vue'),
    meta: { requiresAuth: true, roles: ['CLIENT'] },
    props: true
  },
  {
    path: '/client/pets/:id/medical-history',
    name: 'client-medical-history',
    component: ClientMedicalHistoryView,
    meta: { requiresAuth: true, roles: ['CLIENT'] },
    props: true
  },
  {
    path: '/client/appointments',
    name: 'client-appointments',
    component: ClientAppointmentsView,
    meta: { requiresAuth: true, roles: ['CLIENT'] }
  },
  {
    path: '/client/appointments/new',
    name: 'client-new-appointment',
    component: ClientNewAppointmentView,
    meta: { requiresAuth: true, roles: ['CLIENT'] }
  },
  {
    path: '/client/appointments/:id',
    name: 'client-appointment-detail',
    component: () => import('../views/client/AppointmentDetailView.vue'),
    meta: { requiresAuth: true, roles: ['CLIENT'] },
    props: true
  },
  {
    path: '/client/appointments/:id/reschedule',
    name: 'client-reschedule-appointment',
    component: () => import('../views/client/RescheduleAppointmentView.vue'),
    meta: { requiresAuth: true, roles: ['CLIENT'] },
    props: true
  },

  // === RUTAS PARA VETERINARIOS ===
  {
    path: '/vet',
    name: 'vet-dashboard',
    component: VetDashboardView,
    meta: { requiresAuth: true, roles: ['VET'] }
  },
  {
    path: '/vet/patients',
    name: 'vet-patients',
    component: VetPatientsView,
    meta: { requiresAuth: true, roles: ['VET'] }
  },
  {
    path: '/vet/patients/:id',
    name: 'vet-patient-detail',
    component: VetPatientDetailView,
    meta: { requiresAuth: true, roles: ['VET'] },
    props: true
  },
  {
    path: '/vet/patients/:id/history',
    name: 'vet-patient-history',
    component: () => import('../views/vet/PatientHistoryView.vue'),
    meta: { requiresAuth: true, roles: ['VET'] },
    props: true
  },
  {
    path: '/vet/patients/:id/medical-record/new',
    name: 'vet-new-medical-record',
    component: () => import('../views/vet/NewMedicalRecordView.vue'),
    meta: { requiresAuth: true, roles: ['VET'] },
    props: true
  },
  {
    path: '/vet/appointments',
    name: 'vet-appointments',
    component: VetAppointmentsView,
    meta: { requiresAuth: true, roles: ['VET'] }
  },
  {
    path: '/vet/appointments/new',
    name: 'vet-new-appointment',
    component: () => import('../views/vet/NewAppointmentView.vue'),
    meta: { requiresAuth: true, roles: ['VET'] }
  },
  {
    path: '/vet/appointments/:id',
    name: 'vet-appointment-detail',
    component: () => import('../views/vet/AppointmentDetailView.vue'),
    meta: { requiresAuth: true, roles: ['VET'] },
    props: true
  },
  {
    path: '/vet/schedule',
    name: 'vet-schedule',
    component: VetScheduleView,
    meta: { requiresAuth: true, roles: ['VET'] }
  },
  {
    path: '/vet/medical-records',
    name: 'vet-medical-records',
    component: VetMedicalRecordsView,
    meta: { requiresAuth: true, roles: ['VET'] }
  },

  // === RUTAS DE ADMINISTRADOR ===
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../views/admin/DashboardView.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] }
  },

  // === RUTAS DE ERROR ===
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Redirigir si ya está autenticado y va a login/register
  if (to.meta.redirectIfAuth && authStore.isAuthenticated) {
    const userRole = authStore.userRole
    if (userRole === 'VET') {
      next({ name: 'vet-dashboard' })
    } else if (userRole === 'ADMIN') {
      next({ name: 'admin-dashboard' })
    } else {
      next({ name: 'dashboard' })
    }
    return
  }
  
  // Verificar roles si está especificado
  if (to.meta.roles && authStore.isAuthenticated) {
    const userRole = authStore.userRole
    if (!to.meta.roles.includes(userRole)) {
      // Redirigir al dashboard apropiado según el rol
      if (userRole === 'VET') {
        next({ name: 'vet-dashboard' })
      } else if (userRole === 'ADMIN') {
        next({ name: 'admin-dashboard' })
      } else {
        next({ name: 'dashboard' })
      }
      return
    }
  }
  
  next()
})

export default router 