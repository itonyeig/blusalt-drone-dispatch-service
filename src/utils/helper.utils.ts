import { ConflictException } from "@nestjs/common";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const handleDuplicateError = (error: any) => {
  // Handle duplicate key errors
  console.log('handle duplicate ', error.message);
  if (error?.code === 11000) {
    const fieldName = Object.keys(error.keyPattern)[0]; // Get the field name causing the duplicate
    throw new ConflictException(`${fieldName} already exists`);
  }

  // Fallback for other types of errors
  throw error;
};