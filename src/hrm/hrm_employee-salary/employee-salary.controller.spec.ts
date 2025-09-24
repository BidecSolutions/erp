import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeSalaryController } from './employee-salary.controller';

describe('EmployeeSalaryController', () => {
  let controller: EmployeeSalaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeSalaryController],
    }).compile();

    controller = module.get<EmployeeSalaryController>(EmployeeSalaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
