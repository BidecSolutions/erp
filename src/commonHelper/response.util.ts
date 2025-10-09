

import { NotFoundException } from '@nestjs/common';
import { CodeSequence } from 'src/Company/code_sequences/entities/code_sequence.entity';
import { Repository, ObjectLiteral ,DataSource } from 'typeorm';

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



export async function generateCode(
  module_name: string,
  prefix: string,
  dataSource: DataSource,
): Promise<string> {
  const repo = dataSource.getRepository(CodeSequence);

  // Check if sequence exists
  let sequence = await repo.findOne({ where: { module_name } });

  // If not exists — create new
  if (!sequence) {
    // Check if prefix already used
    const existingPrefix = await repo.findOne({ where: { prefix } });
    if (existingPrefix) {
      throw new Error(`Prefix '${prefix}' is already used by another module`);
    }

    sequence = repo.create({ module_name, prefix, last_number: 0 });
    await repo.save(sequence);
  }

  // Increment
  const newNumber = sequence.last_number + 1;
  const newCode = `${sequence.prefix}-${String(newNumber).padStart(4, '0')}`;

  sequence.last_number = newNumber;
  await repo.save(sequence);

  return newCode;
}



