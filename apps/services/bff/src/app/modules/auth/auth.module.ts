import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CacheModule } from '../cache/cache.module'
import { PKCEService } from './pkce.service'

@Module({
  imports: [CacheModule],
  controllers: [AuthController],
  providers: [AuthService, PKCEService],
})
export class AuthModule { }
