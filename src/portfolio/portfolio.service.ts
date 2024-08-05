// portfolio.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Moralis from 'moralis';
import { Wallet } from '../user/entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import {
  TokenType,
  TransactionPage,
  TransactionType,
  WalletAssets,
} from './portfolio.types';
import { WalletRepository } from 'src/user/wallet.repository';
import { ConfigService } from '@nestjs/config';
import { ethers, JsonRpcProvider, parseEther, parseUnits } from 'ethers';
import { OtpService } from '../auth/otp.service';
import { CursorInput, SendFundsInput } from './inputs/portfolio.input';

@Injectable()
export class PortfolioService {
  public network: EvmChain;
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly settingService: ConfigService,
    private readonly otpService: OtpService,
  ) {
    this.initializeMoralis();
    if (this.settingService.get('TESTNET')) {
      this.network = EvmChain.BSC_TESTNET;
    } else {
      this.network = EvmChain.BSC;
    }
  }

  private async initializeMoralis(): Promise<void> {
    await Moralis.start({
      apiKey: this.settingService.getOrThrow('MORALIS_API_KEY'),
    });
  }

  private async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    return wallet;
  }

  async getWalletBalances(
    userId: string,
    cursor?: CursorInput,
  ): Promise<WalletAssets> {
    try {
      const wallet = await this.getWallet(userId);

      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        chain: this.network,
        address: wallet.address,
        ...cursor,
      });

      const assets = new WalletAssets();
      assets.tokens = response.raw;

      return assets;
    } catch (error) {
      throw new HttpException(
        `Error fetching wallet balances: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async transferEth(privateKey: string, toAddress: string, amount: string) {
    const provider = new JsonRpcProvider(this.network.rpcUrls[0]);
    const wallet = new ethers.Wallet(privateKey, provider);

    const transaction = {
      to: toAddress,
      value: parseEther(amount),
    };

    const sendTransactionResponse = await wallet.sendTransaction(transaction);
    // console.log('ETH Transfer Transaction Hash:', sendTransactionResponse.hash);
    return sendTransactionResponse.hash;
  }

  // Function to transfer ERC-20 tokens
  async transferErc20(
    privateKey: string,
    toAddress: string,
    tokenAddress: string,
    amount: string,
  ) {
    const provider = new JsonRpcProvider(this.network.rpcUrls[0]);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Load ERC-20 token contract
    const erc20Contract = new ethers.Contract(
      tokenAddress,
      [
        'function transfer(address to, uint256 value)',
        'function decimals() view returns (uint8)',
      ],
      wallet,
    );
    const decimals = await erc20Contract.decimals();

    // Transfer tokens
    const transaction = await erc20Contract.transfer(
      toAddress,
      parseUnits(amount, decimals),
    );
    // console.log('ERC-20 Token Transfer Transaction Hash:', transaction.hash);
    return transaction.hash;
  }

  async sendWalletBalances(
    userId: string,
    details: SendFundsInput,
  ): Promise<string> {
    try {
      const wallet = await this.getWallet(userId);
      const verified = await this.otpService.verifyOtp(details.emailOtp);
      if (!verified.meta.isSolved) {
        throw Error(verified.error);
      }
      let hash = '';
      if (
        details.tokenAddress === '0x0000000000000000000000000000000000000000'
      ) {
        hash = await this.transferEth(
          wallet.private_key,
          details.toAddress,
          details.amount,
        );
      } else {
        hash = await this.transferErc20(
          wallet.private_key,
          details.toAddress,
          details.tokenAddress,
          details.amount,
        );
      }
      return hash;
    } catch (error) {
      throw new HttpException(
        `Error fetching wallet balances: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWalletTransactions(
    userId: string,
    cursor?: CursorInput,
  ): Promise<TransactionPage> {
    try {
      const wallet = await this.getWallet(userId);

      const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
        chain: this.network,
        address: wallet.address,
        ...cursor,
      });

      const transactionsPage = new TransactionPage();
      transactionsPage.transactions = response.toJSON();
      transactionsPage.nextCursor = response.raw.cursor;

      return transactionsPage;
    } catch (error) {
      throw new HttpException(
        `Error fetching wallet transactions: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
