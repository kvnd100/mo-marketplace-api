import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VariantsService } from './variants.service';
import { Variant } from './entities/variant.entity';

describe('VariantsService', () => {
  let service: VariantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariantsService,
        {
          provide: getRepositoryToken(Variant),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VariantsService>(VariantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
