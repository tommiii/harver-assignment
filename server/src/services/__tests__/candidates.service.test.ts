import { describe, expect, it, beforeEach } from '@jest/globals';
import { CandidatesService } from '../candidates.service';
import { MAX_MODULE_SCORE, MIN_MODULE_SCORE } from '../../constants';

describe('CandidatesService', () => {
  let service: CandidatesService;

  beforeEach(() => {
    service = new CandidatesService();
  });

  describe('parserCandidatesFromString', () => {
    const validObjectId = '507f1f77bcf86cd799439011';
    const validHeader = 'Vacancy Id,Candidate Id,Module 1,Module 2';
    
    it('should validate ObjectId format for Vacancy and Candidate IDs', () => {
      const invalidId = 'invalid-id';
      const invalidVacancyData = `${validHeader}\n${invalidId},${validObjectId},80,90`;
      const invalidCandidateData = `${validHeader}\n${validObjectId},${invalidId},80,90`;

      expect(() => service.parserCandidatesFromString(invalidVacancyData))
        .toThrow(`Invalid 'Candidate Id': ${invalidId} is not a valid ObjectId`);
      expect(() => service.parserCandidatesFromString(invalidCandidateData))
        .toThrow(`Invalid 'Candidate Id': ${invalidId} is not a valid ObjectId`);
    });

    it('should validate module scores between 0 and 100 with max 2 decimal places', () => {
      // Test score range
      const tooHighScore = `${validHeader}\n${validObjectId},${validObjectId},101,90`;
      const tooLowScore = `${validHeader}\n${validObjectId},${validObjectId},-1,90`;
      const validDecimalScore = `${validHeader}\n${validObjectId},${validObjectId},99.99,90`;
      const invalidDecimalScore = `${validHeader}\n${validObjectId},${validObjectId},99.999,90`;

      expect(() => service.parserCandidatesFromString(tooHighScore))
        .toThrow(`Score must be between ${MIN_MODULE_SCORE} and ${MAX_MODULE_SCORE}`);
      expect(() => service.parserCandidatesFromString(tooLowScore))
        .toThrow(`Score must be between ${MIN_MODULE_SCORE} and ${MAX_MODULE_SCORE}`);
      expect(() => service.parserCandidatesFromString(validDecimalScore)).not.toThrow();
      expect(() => service.parserCandidatesFromString(invalidDecimalScore))
        .toThrow('Score can have maximum 2 decimal places');
    });

    it('should handle different numbers of modules', () => {
      const oneModule = `${validHeader}\n${validObjectId},${validObjectId},80`;
      const threeModules = `${validHeader}\n${validObjectId},${validObjectId},80,85,90`;
      const mixedModules = `${validHeader}\n${validObjectId},${validObjectId},80,X,90`;

      const oneModuleResult = service.parserCandidatesFromString(oneModule);
      const threeModulesResult = service.parserCandidatesFromString(threeModules);
      const mixedModulesResult = service.parserCandidatesFromString(mixedModules);

      expect(oneModuleResult[0].averageModuleScores).toBe(80);
      expect(threeModulesResult[0].averageModuleScores).toBe(85);
      expect(mixedModulesResult[0].averageModuleScores).toBe(85); // Average of 80 and 90, ignoring X
    });

    it('should handle valid data with multiple candidates', () => {
      const validData = `${validHeader}
${validObjectId},${validObjectId},80,90
${validObjectId},${validObjectId},85,95`;

      const result = service.parserCandidatesFromString(validData);
      
      expect(result).toHaveLength(2);
      expect(result[0].averageModuleScores).toBe(85);
      expect(result[1].averageModuleScores).toBe(90);
      expect(result[0].applicationOrder).toBe(0);
      expect(result[1].applicationOrder).toBe(1);
    });
  });
}); 