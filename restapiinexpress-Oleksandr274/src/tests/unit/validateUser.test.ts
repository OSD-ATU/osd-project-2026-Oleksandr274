import { createUserSchema } from "../../models/users";

const validUser = {
  "firstName": "Alex",
  "lastName": "Ferguson",
  "phonenumber": "+353871234567",
  "email": "alex.ferguson@gmail.com",
  "password": "password12345",
  "dob": "12-31-1941",
  "address": "The Manchester House"
}

describe('Date of Birth Validation', () => {
  it('should pass for the following valid data', () => {

    expect(() => createUserSchema.parse(
      validUser)).not.toThrow();
  });

  it('should fail for the unparasable date 45/12/2023', () => {

    expect(() => createUserSchema.parse(
      { ...validUser, "dob": '45/12/2023' })).toThrow();
  });
});


describe('Date of Birth Validation', () => {
  it('should pass for the following valid dates', () => {
    const validDates = [
      '1970/01/01',
      '1987/12/03',
      '1987-11-30'
    ];

    validDates.forEach((date) => {
      expect(() => createUserSchema.parse(
        { ...validUser, "dob": date, })).not.toThrow();
    });
  });

  it('should fail for invalid Dates', () => {
    const invalidDates = [
      '2026ty/01/02',         // wrong year
      '2000/13/01',          // wrong month
      '09/10/2026',          // in the future
      '1st march 20121',      // wrong date
      'blah balh',     // wrong string
    ];

    invalidDates.forEach((date) => {
      expect(() => createUserSchema.parse(
        { ...validUser, "dob": date, })).toThrow();
    });
  });
});
