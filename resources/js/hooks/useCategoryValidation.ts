import { useState, useEffect } from 'react';
import { Category } from '@/types';

// Subset of the existing Category interface for the form
export type CategoryFormData = Pick<Category, 'name' | 'description'>;

export type CategoryValidationErrors = {
  name?: string;
  description?: string;
};

export function useCategoryValidation(formData: CategoryFormData) {
  const [validationErrors, setValidationErrors] = useState<CategoryValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Update tyhe form validity whenever validation errors or form data changes
  useEffect(() => {
    const hasValidationErrors = Object.values(validationErrors).some(error => !!error);
    const requiredFieldsMissing = !formData.name;
    
    setIsFormValid(!hasValidationErrors && !requiredFieldsMissing);
  }, [validationErrors, formData]);

  // Function to validate name
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        name: 'Category name is required'
      }));
      return false;
    }
    
    if (name.length > 255) {
      setValidationErrors(prev => ({
        ...prev,
        name: 'Category name must be less than 255 characters'
      }));
      return false;
    }
    
    // Check for potentially malicious content or invalid characters
    const suspiciousPattern = /<script|javascript:|onerror=|onclick=|onload=|\(\)|eval\(|alert\(/i;
    if (suspiciousPattern.test(name)) {
      setValidationErrors(prev => ({
        ...prev,
        name: 'Category name contains potentially unsafe content'
      }));
      return false;
    }

    // Check for special characters that might cause issues
    const specialCharsPattern = /[<>{}[\]\\\/]/;
    if (specialCharsPattern.test(name)) {
      setValidationErrors(prev => ({
        ...prev,
        name: 'Category name contains invalid special characters'
      }));
      return false;
    }
    
    // Clear error if valid
    setValidationErrors(prev => ({...prev, name: undefined}));
    return true;
  };

  // Function to validate description
  const validateDescription = (text: string): boolean => {
    if (!text) return true; // Empty is valid
    
    // Check for excessive length
    if (text.length > 1000) {
      setValidationErrors(prev => ({
        ...prev,
        description: 'Description must be less than 1000 characters'
      }));
      return false;
    }
    
    // Check for script tags, HTML tags, or suspicious patterns
    const scriptPattern = /<script|<iframe|<img|<object|javascript:|onerror=|onclick=|onload=|eval\(|setTimeout\(|document\.|window\.|alert\(|console\./i;
    if (scriptPattern.test(text)) {
      setValidationErrors(prev => ({
        ...prev,
        description: 'Description contains potentially unsafe content'
      }));
      return false;
    }

    // Clear error if valid
    setValidationErrors(prev => ({...prev, description: undefined}));
    return true;
  };

  // Function to validate all fields at once (for form submission)
  const validateAll = (): boolean => {
    const nameValid = validateName(formData.name);
    const descriptionValid = validateDescription(formData.description);
    
    return nameValid && descriptionValid;
  };

  return {
    validationErrors,
    isFormValid,
    validateName,
    validateDescription,
    validateAll
  };
}