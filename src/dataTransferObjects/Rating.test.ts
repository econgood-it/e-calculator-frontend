import { RatingSchema, RatingType } from './Rating';

describe('Rating', () => {
  it('should parse json as rating', () => {
    const json = {
      shortName: 'A1',
      name: 'Human dignity in the supply chain',
      estimations: 0,
      isPositive: true,
      type: RatingType.topic,
    };
    const rating = RatingSchema.parse(json);
    expect(rating).toMatchObject(json);
  });

  it.each([{ estimations: 11 }, { estimations: -2 }])(
    'should fail for invalid estimations if aspect is positive ',
    ({ estimations }) => {
      const json = {
        shortName: 'A1',
        name: 'Human dignity in the supply chain',
        estimations: estimations,
        isPositive: true,
        type: RatingType.aspect,
      };
      const expectedError = {
        code: 'custom',
        message: 'Number should be between 0 and 10',
        path: ['estimations'],
      };
      const result = RatingSchema.safeParse(json);
      expect(result.success).toBeFalsy();
      expect(!result.success && result.error.errors[0]).toStrictEqual(
        expectedError
      );
    }
  );

  it.each([{ estimations: 1 }, { estimations: -201 }])(
    'should fail for invalid estimations if aspect is negative ',
    ({ estimations }) => {
      const json = {
        shortName: 'A1',
        name: 'Human dignity in the supply chain',
        estimations: estimations,
        isPositive: false,
        type: RatingType.aspect,
      };
      const expectedError = {
        code: 'custom',
        message: 'Number should be between -200 and 0',
        path: ['estimations'],
      };
      const result = RatingSchema.safeParse(json);
      expect(result.success).toBeFalsy();
      expect(!result.success && result.error.errors[0]).toStrictEqual(
        expectedError
      );
    }
  );

  it.each([{ estimations: 1 }, { estimations: -201 }, { estimations: 11 }])(
    'should parse rating if rating type is topic ',
    ({ estimations }) => {
      const json = {
        shortName: 'A1',
        name: 'Human dignity in the supply chain',
        estimations: estimations,
        isPositive: false,
        type: RatingType.topic,
      };
      const rating = RatingSchema.parse(json);
      expect(rating).toBe(rating);
    }
  );
});
