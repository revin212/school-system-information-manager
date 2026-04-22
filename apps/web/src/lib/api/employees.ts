import type { Employee, EmployeeStatus, EmployeeType } from '../mockApi/types'
import { apiFetch } from './http'

export type ListEmployeesParams = {
  q?: string
  tipe?: EmployeeType | ''
  status?: EmployeeStatus | ''
}

export async function listEmployees(params: ListEmployeesParams): Promise<Employee[]> {
  return apiFetch('/api/v1/employees', {
    method: 'GET',
    query: {
      q: params.q ?? '',
      tipe: params.tipe ?? '',
      status: params.status ?? '',
    },
  })
}

export async function createEmployee(input: {
  nip: string
  nama: string
  tipe: EmployeeType
  noHp: string
  email?: string
  status: EmployeeStatus
}): Promise<Employee> {
  return apiFetch('/api/v1/employees', { method: 'POST', body: input })
}

export async function updateEmployee(
  id: string,
  patch: Partial<Pick<Employee, 'nip' | 'nama' | 'tipe' | 'noHp' | 'email' | 'status'>>,
): Promise<Employee> {
  return apiFetch(`/api/v1/employees/${id}`, { method: 'PATCH', body: patch })
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiFetch(`/api/v1/employees/${id}`, { method: 'DELETE' })
}

