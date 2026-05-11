export interface LoginRequest { login: string; password: string }
export interface LoginResponse { token: string; fullName: string; role: string; employeeId: number }

export interface CarDto {
  carId: number; vin: string; modelId: number; modelName: string; brandName: string
  year: number; color: string; mileage: number; price: number
  statusId: number; statusName: string; arrivalDate: string; notes?: string
}

export interface ClientDto {
  clientId: number; lastName: string; firstName: string; patronymic: string
  phone: string; email: string; passportSeries: string; passportNumber: string
  birthDate: string; address: string
}

export interface EmployeeDto {
  employeeId: number; lastName: string; firstName: string; patronymic: string
  roleId: number; roleName: string; phone: string; email: string
  hireDate: string; login: string
}

export interface DealDto {
  dealId: number; carId: number; carInfo: string; clientId: number; clientName: string
  employeeId: number; employeeName: string; dealDate: string
  finalPrice: number; paymentType: string; notes?: string
}

export interface ReservationDto {
  reservationId: number; carId: number; carInfo: string; clientId: number; clientName: string
  employeeId: number; employeeName: string; reservationDate: string
  expiryDate: string; deposit: number
}

export interface TestDriveDto {
  tdId: number; carId: number; carInfo: string; clientId: number; clientName: string
  employeeId: number; employeeName: string; tdDate: string; feedback?: string
}

export interface DashboardStats {
  totalCars: number; availableCars: number; reservedCars: number; soldCars: number
  totalClients: number; totalDeals: number; activeReservations: number; totalTestDrives: number
  totalRevenue: number
}

export interface BrandDto { brandId: number; brandName: string; country: string }
export interface ModelDto { modelId: number; brandId: number; brandName: string; modelName: string; bodyType: string; engineVol: number; fuelType: string }
export interface StatusDto { statusId: number; statusName: string }
export interface RoleDto { roleId: number; roleName: string }
