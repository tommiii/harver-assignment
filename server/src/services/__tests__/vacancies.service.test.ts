import { describe, expect, it, beforeEach } from '@jest/globals';
import { VacanciesService } from '../vacancies.service';
import { MAX_HIRING_LIMIT } from '../../constants';

describe('VacanciesService', () => {
  let service: VacanciesService;

  beforeEach(() => {
    service = new VacanciesService();
  });

  describe('parserVacanciesFromString', () => {
    const validObjectId = '507f1f77bcf86cd799439011';
    const validHeader = 'Vacancy Id,Hiring Limit';
    
    it('should validate ObjectId format for Vacancy IDs', () => {
      const invalidId = 'invalid-id';
      const invalidData = `${validHeader}\n${invalidId},5`;

      expect(() => service.parserVacanciesFromString(invalidData))
        .toThrow(`Invalid 'Vacancy Id': ${invalidId} is not a valid ObjectId`);
    });

    it('should validate hiring limit is below 1,000,000', () => {
      const tooHighLimit = `${validHeader}\n${validObjectId},1000000`;
      const validLimit = `${validHeader}\n${validObjectId},999999`;
      const negativeLimit = `${validHeader}\n${validObjectId},-1`;
      const nonIntegerLimit = `${validHeader}\n${validObjectId},abc`;

      expect(() => service.parserVacanciesFromString(tooHighLimit))
        .toThrow(`Hiring limit must be between 0 and ${MAX_HIRING_LIMIT}`);
      expect(() => service.parserVacanciesFromString(negativeLimit))
        .toThrow(`Hiring limit must be between 0 and ${MAX_HIRING_LIMIT}`);
      expect(() => service.parserVacanciesFromString(nonIntegerLimit))
        .toThrow(`Invalid hiring limit for vacancy ${validObjectId}: must be an integer`);
      expect(() => service.parserVacanciesFromString(validLimit)).not.toThrow();
    });

    it('should handle valid data with multiple vacancies', () => {
      const validData = `${validHeader}
${validObjectId},5
${validObjectId},10`;

      const result = service.parserVacanciesFromString(validData);
      
      expect(result).toHaveLength(2);
      expect(result[0].hiringLimit).toBe(5);
      expect(result[1].hiringLimit).toBe(10);
      expect(result[0].id).toBe(validObjectId);
      expect(result[1].id).toBe(validObjectId);
    });

    it('should validate header format', () => {
      const invalidHeader1 = 'Wrong Header,Hiring Limit';
      const invalidHeader2 = 'Vacancy Id,Wrong Header';
      
      expect(() => service.parserVacanciesFromString(`${invalidHeader1}\n${validObjectId},5`))
        .toThrow(/Invalid Vacancy header/);
      expect(() => service.parserVacanciesFromString(`${invalidHeader2}\n${validObjectId},5`))
        .toThrow(/Invalid Vacancy header/);
    });
  });
}); 