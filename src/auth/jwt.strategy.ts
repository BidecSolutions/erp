import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants';
import { User } from 'src/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      .innerJoin('roles', 'r', 'r.id = urm.roll_id') // <-- check spelling here
      .select([
        "user.id as id",
        "user.name as name",
        "r.role_name as role_name",
        "r.id as role_id"
      ])
      .where("user.id = :user_id", { user_id })
      .getRawOne();

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    if (user.role_id != 1 && user.role_id != 2) {
      throw new UnauthorizedException('Only Admin Can Access');
    }
    return { user };
  }
}