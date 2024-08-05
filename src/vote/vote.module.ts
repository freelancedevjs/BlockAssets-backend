import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/modules/typeorm.module';
import { VoteService } from './vote.service';
import { VoteEntryRepository, VoteRepository } from './vote.repository';
import { VoteResolver } from './vote.resolver';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([VoteRepository, VoteEntryRepository]),
  ],
  providers: [VoteService, VoteResolver],
  exports: [VoteService],
})
export class VoteModule {}
