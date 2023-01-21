import { IndustrySchema } from './Industry';

describe('Industry', () => {
  it('should be created from json', () => {
    const json = { industryCode: 'A', industryName: 'agriculture' };
    const region = IndustrySchema.parse(json);
    expect(region).toMatchObject(json);
  });
});
