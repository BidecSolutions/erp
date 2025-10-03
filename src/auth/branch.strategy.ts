import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { jwtConstants } from './constants';
import { User } from 'src/entities/user.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { Branch } from 'src/Company/branch/branch.entity';

@Injectable()
export class BranchStrategy extends PassportStrategy(Strategy, 'Branch') {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(userCompanyMapping)
        private readonly companyMaping: Repository<userCompanyMapping>,

        @InjectRepository(Branch)
        private readonly branches: Repository<Branch>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // better to not ignore expiration
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        const user_id = payload.sub;
        const user = await this.userRepository.createQueryBuilder('user')
            .innerJoin('user_role_mapping', 'urm', 'user.id = urm.user_id')
            .select([
                "user.id as id",
                "user.name as name",
                "urm.roll_id as role_id"
            ])
            .where("user.id = :user_id", { user_id })
            .getRawOne();
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }

        if (user.role_id != 1 && user.role_id != 2) {
            throw new UnauthorizedException('Only Admin Can Access');
        }

        const branches = await this.companyMaping.findOne({ where: { user_id: user_id } })
        let allBranches: Branch[] = [];
        if (branches && Array.isArray(branches.branch_id)) {
            allBranches = await this.branches.find({
                where: { id: In(branches.branch_id) },
                select: ({ id: true, branch_name: true })
            });
        }
        if (user.role_id == 2 && allBranches.length == 0) {
            throw new UnauthorizedException('First Create You Banch');
        }
        return { user, branches: allBranches ? allBranches : null, company_id: branches ? branches.company_id : null };
    }
}