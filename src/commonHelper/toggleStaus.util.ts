import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export async function toggleStatus<T extends ObjectLiteral>(
  repo: Repository<T>,
  id: number,
  field: keyof T, // kis column ko toggle karna hai (e.g., 'status')
): Promise<T> {
  const entity = await repo.findOne({ where: { id } as any });

  if (!entity) {
    throw new NotFoundException(`${repo.metadata.name} #${id} not found`);
  }

  // toggle logic
  const currentValue = entity[field] as unknown as number;
  (entity as any)[field] = currentValue === 1 ? 0 : 1;

  return repo.save(entity);
}
