import { describe, expect, it, beforeEach } from '@jest/globals';
import { MatchEngineService } from '../match-engine.service';

describe('MatchEngineService', () => {
  let service: MatchEngineService;

  beforeEach(() => {
    service = new MatchEngineService();
  });

  describe('match', () => {
    const validObjectId1 = '507f1f77bcf86cd799439011';
    const validObjectId2 = '507f1f77bcf86cd799439012';
    const validObjectId3 = '507f1f77bcf86cd799439013';

    it('should match candidates to vacancies based on average scores and application order', () => {
      const testData = `Vacancy Id,Hiring Limit
${validObjectId1},2
${validObjectId2},1
=
Vacancy Id,Candidate Id,Module 1,Module 2
${validObjectId1},${validObjectId1},80,90
${validObjectId1},${validObjectId2},90,90
${validObjectId1},${validObjectId3},85,85
${validObjectId2},${validObjectId1},70,80
${validObjectId2},${validObjectId2},90,90`;

      const result = service.match(testData);

      // Check vacancy 1 results (hiring limit: 2)
      expect(result[0].vacancyId).toBe(validObjectId1);
      expect(result[0].hiringLimit).toBe(2);
      expect(result[0].candidates).toHaveLength(2);
      // First candidate should be the one with highest average (90)
      expect(result[0].candidates[0].id).toBe(validObjectId2);
      expect(result[0].candidates[0].averageModuleScores).toBe(90);
      // Second candidate should be the one with next highest average (85)
      expect(result[0].candidates[1].id).toBe(validObjectId1);
      expect(result[0].candidates[1].averageModuleScores).toBe(85);

      // Check vacancy 2 results (hiring limit: 1)
      expect(result[1].vacancyId).toBe(validObjectId2);
      expect(result[1].hiringLimit).toBe(1);
      expect(result[1].candidates).toHaveLength(1);
      // Should select the candidate with highest average (90)
      expect(result[1].candidates[0].id).toBe(validObjectId2);
      expect(result[1].candidates[0].averageModuleScores).toBe(90);
    });

    it('should handle tie-breaking based on application order', () => {
      const testData = `Vacancy Id,Hiring Limit
${validObjectId1},1
=
Vacancy Id,Candidate Id,Module 1,Module 2
${validObjectId1},${validObjectId1},90,90
${validObjectId1},${validObjectId2},90,90`;

      const result = service.match(testData);

      // Should select the first applicant when scores are tied
      expect(result[0].candidates).toHaveLength(1);
      expect(result[0].candidates[0].id).toBe(validObjectId1);
      expect(result[0].candidates[0].averageModuleScores).toBe(90);
    });

    it('should handle vacancies with no candidates', () => {
      const testData = `Vacancy Id,Hiring Limit
${validObjectId1},1
${validObjectId2},1
=
Vacancy Id,Candidate Id,Module 1,Module 2
${validObjectId1},${validObjectId1},90,90`;

      const result = service.match(testData);

      expect(result).toHaveLength(2);
      expect(result[0].candidates).toHaveLength(1);
      expect(result[1].candidates).toHaveLength(0);
    });

    it('should handle different numbers of modules', () => {
      const testData = `Vacancy Id,Hiring Limit
${validObjectId1},2
=
Vacancy Id,Candidate Id,Module 1,Module 2,Module 3
${validObjectId1},${validObjectId1},90,90,90
${validObjectId1},${validObjectId2},85,85,X`;

      const result = service.match(testData);

      expect(result[0].candidates).toHaveLength(2);
      expect(result[0].candidates[0].id).toBe(validObjectId1);
      expect(result[0].candidates[0].averageModuleScores).toBe(90);
      expect(result[0].candidates[1].id).toBe(validObjectId2);
      expect(result[0].candidates[1].averageModuleScores).toBe(85);
    });
  });
}); 