import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, AuthSigninDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDto) {
        // generate the password hash
        const hash = await argon.hash(dto.password);

        // save the new user to the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    login_name: dto.login_name,
                    name: dto.name,
                    hash,
                },
            });
    
            // temporal line
            delete user.hash;
    
            // return the saved user
            return user;
        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error .code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthSigninDto) {
        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                login_name: dto.login_name,
            }
        })
        // throw exception if the user does not exist
        if (!user) throw new ForbiddenException('Credentials incorrect');

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password);
        // throw exception if the password is incorrect
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

        // temporal
        delete user.hash

        // send back the user
        return user;
    }
}
