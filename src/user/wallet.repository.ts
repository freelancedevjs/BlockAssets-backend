import { CustomRepository } from '../common/decorators/typeorm.decorator';
import { ExtendedRepository } from 'src/common/graphql/customExtended';
import { Wallet } from './entities/wallet.entity';

@CustomRepository(Wallet)
export class WalletRepository extends ExtendedRepository<Wallet> {}
