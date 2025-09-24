import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyContribution } from './company-contribution.entity';
import { CreateCompanyContributionDto } from './dto/create-company-contribution.dto';
import { UpdateCompanyContributionDto } from './dto/update-company-contribution.dto';

@Injectable()
export class CompanyContributionService {
  constructor(
    @InjectRepository(CompanyContribution)
    private readonly contributionRepo: Repository<CompanyContribution>,
  ) {}

  async create(dto: CreateCompanyContributionDto) {
    const contribution = this.contributionRepo.create(dto);
    return this.contributionRepo.save(contribution);
  }

  async findAll() {
    return this.contributionRepo.find();
  }

  async findOne(id: number) {
    const contribution = await this.contributionRepo.findOne({ where: { id } });
    if (!contribution) throw new NotFoundException('Contribution not found');
    return contribution;
  }

  async update(id: number, dto: UpdateCompanyContributionDto) {
    const contribution = await this.findOne(id);
    Object.assign(contribution, dto);
    return this.contributionRepo.save(contribution);
  }

  async remove(id: number) {
    const contribution = await this.findOne(id);
    return this.contributionRepo.remove(contribution);
  }
}
