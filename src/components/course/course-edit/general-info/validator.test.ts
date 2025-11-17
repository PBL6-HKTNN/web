// src/components/course/course-edit/general-info/validator.test.ts
import { describe, it, expect } from 'vitest';
import { courseFormSchema } from './validator';

describe('courseFormSchema', () => {
  const validData = {
    title: 'React Masterclass',
    description: 'Learn React from scratch',
    thumbnail: 'https://example.com/thumb.jpg',
    categoryId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    price: 99,
    level: 1 as 0 | 1 | 2,
    language: 'en',
  };

  it('passes with valid data', () => {
    const result = courseFormSchema.parse(validData);
    expect(result).toEqual(validData);
  });

  it('allows empty description', () => {
    const data = { ...validData, description: undefined };
    expect(() => courseFormSchema.parse(data)).not.toThrow();
  });

  it('allows empty thumbnail (or empty string)', () => {
    const data1 = { ...validData, thumbnail: '' };
    const data2 = { ...validData, thumbnail: undefined };

    expect(() => courseFormSchema.parse(data1)).not.toThrow();
    expect(() => courseFormSchema.parse(data2)).not.toThrow();
  });

  // TITLE
  it('requires title', () => {
    const data = { ...validData, title: '' };
    expect(() => courseFormSchema.parse(data)).toThrow('Title is required');
  });

  it('enforces title max length', () => {
    const longTitle = 'a'.repeat(201);
    const data = { ...validData, title: longTitle };
    expect(() => courseFormSchema.parse(data)).toThrow('Title must be less than 200 characters');
  });

  // DESCRIPTION
  it('enforces description max length', () => {
    const longDesc = 'a'.repeat(1001);
    const data = { ...validData, description: longDesc };
    expect(() => courseFormSchema.parse(data)).toThrow('Description must be less than 1000 characters');
  });

  // THUMBNAIL
  it('requires valid URL for thumbnail', () => {
    const data = { ...validData, thumbnail: 'not-a-url' };
    expect(() => courseFormSchema.parse(data)).toThrow('Invalid URL format');
  });

  // CATEGORY ID
  it('requires valid UUID for categoryId', () => {
    const data = { ...validData, categoryId: 'invalid-uuid' };
    expect(() => courseFormSchema.parse(data)).toThrow('Invalid category');
  });

  // PRICE
  it('requires price >= 0', () => {
    const data = { ...validData, price: -1 };
    expect(() => courseFormSchema.parse(data)).toThrow('Price must be positive');
  });

  // LEVEL
  it('only allows level 0, 1, or 2', () => {
    const dataInvalid = { ...validData, level: 3 };
    expect(() => courseFormSchema.parse(dataInvalid)).toThrow('Invalid level');
  });

  it('allows level 0, 1, 2', () => {
    [0, 1, 2].forEach((level) => {
      const data = { ...validData, level };
      expect(() => courseFormSchema.parse(data)).not.toThrow();
    });
  });

  // LANGUAGE
  it('requires language', () => {
    const data = { ...validData, language: '' };
    expect(() => courseFormSchema.parse(data)).toThrow('Language is required');
  });

  // TYPE INFERENCE
  it('infers correct type for CourseFormData', () => {
    type Expected = {
      title: string;
      description?: string;
      thumbnail?: string;
      categoryId: string;
      price: number;
      level: 0 | 1 | 2;
      language: string;
    };

    const result: Expected = courseFormSchema.parse(validData);
    expect(result).toBeDefined();
  });
});