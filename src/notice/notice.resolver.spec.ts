import { Test, TestingModule } from '@nestjs/testing';
import { NoticeResolver } from './notice.resolver';
import {
  MockService,
  MockServiceFactory,
} from 'src/common/factory/mockFactory';
import { NoticeService } from './notice.service';
import { GetManyInput, GetOneInput } from 'src/common/graphql/custom.input';
import { Notice } from './entities/notice.entity';
import { getRandomNumber } from 'src/util/getRandomNumber';
import { CreateNoticeInput, UpdateNoticeInput } from './inputs/notice.input';

describe('NoticeResolver', () => {
  let resolver: NoticeResolver;
  let mockedService: MockService<NoticeService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticeResolver,
        {
          provide: NoticeService,
          useFactory: MockServiceFactory.getMockService(NoticeService),
        },
      ],
    }).compile();

    resolver = module.get<NoticeResolver>(NoticeResolver);
    mockedService = module.get<MockService<NoticeService>>(NoticeService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Calling "Get many notice list" method', () => {
    const qs: GetManyInput<Notice> = {
      where: { id: getRandomNumber(0, 999999) },
    };

    const gqlQuery = `
      query GetManyNoticeList {
        getManyNoticeList {
          data {
            id
          }
        }
      }
    `;

    expect(resolver.getManyNoticeList(qs, gqlQuery)).not.toEqual(null);
    expect(mockedService.getMany).toHaveBeenCalledWith(qs, gqlQuery);
  });

  it('Calling "Get one notice list" method', () => {
    const qs: GetOneInput<Notice> = {
      where: { id: getRandomNumber(0, 999999) },
    };

    const gqlQuery = `
      query GetOneNotice {
        getOneNotice {
          data {
            id
          }
        }
      }
    `;

    expect(resolver.getOneNotice(qs, gqlQuery)).not.toEqual(null);
    expect(mockedService.getOne).toHaveBeenCalledWith(qs, gqlQuery);
  });

  it('Calling "Create notice" method', () => {
    const dto = new CreateNoticeInput();

    expect(resolver.createNotice(dto)).not.toEqual(null);
    expect(mockedService.create).toHaveBeenCalledWith(dto);
  });

  it('Calling "Update notice" method', () => {
    const id = getRandomNumber(0, 999999);
    const dto = new UpdateNoticeInput();

    resolver.updateNotice(id, dto);

    expect(mockedService.update).toHaveBeenCalledWith(id, dto);
  });

  it('Calling "Delete notice" method', () => {
    const id = getRandomNumber(0, 999999);

    resolver.deleteNotice(id);

    expect(mockedService.delete).toHaveBeenCalledWith(id);
  });
});
