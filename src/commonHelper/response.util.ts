

import { Repository, ObjectLiteral } from 'typeorm';
export function successResponse(message: string, data: any = null) {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string, error: any = null) {
  return {
    success: false,
    message,
    error,
  };
}


export function toggleStatusResponse(entity: string, status: number) {
  return {
    success: true,
    message:
      status === 1
        ? `${entity} activated successfully`
        : `${entity} deactivated successfully`,
    status,
  };
}


export async function getActiveList<T extends ObjectLiteral>(
  repo: Repository<T>,
  orderBy?: keyof T
): Promise<Partial<T>[]> {
  const where: any = { status: 1 };
  const order: any = {};

  return repo.find({
    where,
    order,
    select: ['id', orderBy as string], 
  });
}


