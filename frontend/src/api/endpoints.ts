import api from './client'
import type {
  LoginRequest, LoginResponse, CarDto, ClientDto, EmployeeDto,
  DealDto, ReservationDto, TestDriveDto, DashboardStats,
  BrandDto, ModelDto, StatusDto, RoleDto,
  MonthlyRevenueDto, TopModelDto, StatusDistDto,
  ClientDetailsDto, AuditLogDto
} from '../types'

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
}

export const dashboardApi = {
  getStats:        () => api.get<DashboardStats>('/dashboard/stats'),
  getMonthlyRev:   () => api.get<MonthlyRevenueDto[]>('/dashboard/monthly-revenue'),
  getTopModels:    () => api.get<TopModelDto[]>('/dashboard/top-models'),
  getStatusDist:   () => api.get<StatusDistDto[]>('/dashboard/status-dist'),
}

export const carsApi = {
  getAll:       ()                        => api.get<CarDto[]>('/cars'),
  create:       (data: object)            => api.post<CarDto>('/cars', data),
  update:       (id: number, data: object)=> api.put<CarDto>(`/cars/${id}`, data),
  delete:       (id: number)              => api.delete(`/cars/${id}`),
  updateStatus: (id: number, statusId: number) => api.patch<CarDto>(`/cars/${id}/status`, { statusId }),
}

export const clientsApi = {
  getAll:  ()                        => api.get<ClientDto[]>('/clients'),
  create:  (data: object)            => api.post<ClientDto>('/clients', data),
  update:  (id: number, data: object)=> api.put<ClientDto>(`/clients/${id}`, data),
  delete:  (id: number)              => api.delete(`/clients/${id}`),
}

export const employeesApi = {
  getAll:  ()                        => api.get<EmployeeDto[]>('/employees'),
  create:  (data: object)            => api.post<EmployeeDto>('/employees', data),
  update:  (id: number, data: object)=> api.put<EmployeeDto>(`/employees/${id}`, data),
  delete:  (id: number)              => api.delete(`/employees/${id}`),
}

export const dealsApi = {
  getAll:  ()                        => api.get<DealDto[]>('/deals'),
  create:  (data: object)            => api.post<DealDto>('/deals', data),
  update:  (id: number, data: object)=> api.put<DealDto>(`/deals/${id}`, data),
  delete:  (id: number)              => api.delete(`/deals/${id}`),
}

export const reservationsApi = {
  getAll:  ()                        => api.get<ReservationDto[]>('/reservations'),
  create:  (data: object)            => api.post<ReservationDto>('/reservations', data),
  update:  (id: number, data: object)=> api.put<ReservationDto>(`/reservations/${id}`, data),
  delete:  (id: number)              => api.delete(`/reservations/${id}`),
}

export const testDrivesApi = {
  getAll:  ()                        => api.get<TestDriveDto[]>('/testdrives'),
  create:  (data: object)            => api.post<TestDriveDto>('/testdrives', data),
  update:  (id: number, data: object)=> api.put<TestDriveDto>(`/testdrives/${id}`, data),
  delete:  (id: number)              => api.delete(`/testdrives/${id}`),
}

export const refsApi = {
  getBrands:    () => api.get<BrandDto[]>('/references/brands'),
  getModels:    () => api.get<ModelDto[]>('/references/models'),
  getStatuses:  () => api.get<StatusDto[]>('/references/statuses'),
  getRoles:     () => api.get<RoleDto[]>('/references/roles'),

  createBrand:  (data: object) => api.post<BrandDto>('/references/brands', data),
  updateBrand:  (id: number, data: object) => api.put<BrandDto>(`/references/brands/${id}`, data),
  deleteBrand:  (id: number) => api.delete(`/references/brands/${id}`),

  createModel:  (data: object) => api.post<ModelDto>('/references/models', data),
  updateModel:  (id: number, data: object) => api.put<ModelDto>(`/references/models/${id}`, data),
  deleteModel:  (id: number) => api.delete(`/references/models/${id}`),
}

export const clientDetailsApi = {
  getDetails: (id: number) => api.get<ClientDetailsDto>(`/clients/${id}/details`),
}

export const auditApi = {
  getAll: (page = 1, limit = 50) => api.get<AuditLogDto[]>(`/admin/audit?page=${page}&limit=${limit}`),
}
