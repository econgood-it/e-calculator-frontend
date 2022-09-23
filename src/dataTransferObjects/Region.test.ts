import { RegionSchema } from './Region';

describe('Region', () => {
  it('should be created from json', () => {
    const json = { countryCode: 'DEU', countryName: 'Germany' };
    const region = RegionSchema.parse(json);
    expect(region).toMatchObject(json);
  });
});
