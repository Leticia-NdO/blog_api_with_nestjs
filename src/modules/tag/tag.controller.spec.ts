import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

describe('TagController', () => {
  let sut: TagController;
  let tagService: TagService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagService],
    }).compile();

    sut = app.get<TagController>(TagController);
    tagService = app.get<TagService>(TagService);
  });

  it('Should call TagService with correct values', () => {
    const findAllSpy = jest.spyOn(tagService, 'findAll');
    sut.findAll();
    expect(findAllSpy).toHaveBeenCalled();
  });
  it('Should return string array on success', () => {
    expect(sut.findAll()).toEqual(['dragons', 'coffee']);
  });
});
