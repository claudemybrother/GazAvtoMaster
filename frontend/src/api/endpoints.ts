import api from './client'
import type { LoginRequest, LoginResponse, CarDto, ClientDto, EmployeeDto, DealDto, ReservationDto, TestDriveDto, DashboardStats, BrandDto, ModelDto, StatusDto, RoleDto } from '../types'

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
}

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
}

export const carsApi = {
  getAll: () => api.get<CarDto[]>('/cars'),
  updateStatus: (id: number, statusId: number) => api.patch<CarDto>(`/cars/${id}/status`, { statusId }),
}

export const clientsApi = {
  getAll: () => api.get<ClientDto[]>('/clients'),
}

export const employeesApi = {
  getAll: () => api.get<EmployeeDto[]>('/employees'),
}

export const dealsApi = {
  getAll: () => api.get<DealDto[]>('/deals'),
}

export const reservationsApi = {
  getAll: () => api.get<ReservationDto[]>('/reservations'),
}

export const testDrivesApi = {
  getAll: () => api.get<TestDriveDto[]>('/testdrives'),
}

export const refsApi = {
  getBrands: () => api.get<BrandDto[]>('/references/brands'),
  getModels: () => api.get<ModelDto[]>('/references/models'),
  getStatuses: () => api.get<StatusDto[]>('/references/statuses'),
  getRoles: () => api.get<RoleDto[]>('/references/roles'),
}
