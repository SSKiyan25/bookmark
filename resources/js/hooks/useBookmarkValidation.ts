import { useState, useEffect } from 'react';
import { Category } from '@/types';

// Reuse the existing types
export type BookmarkFormData = {
  title: string;
  url: string;
  description: string;
  category_id: string;
  is_archived: boolean;
};

export type ValidationErrors = {
  title?: string;
  url?: string;
  description?: string;
  category_id?: string;
};

export function useBookmarkValidation(formData: BookmarkFormData, categories: Category[]) {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Update form validity whenever validation errors or form data changes
  useEffect(() => {
    const hasValidationErrors = Object.values(validationErrors).some(error => !!error);
    const requiredFieldsMissing = !formData.title || !formData.url || !formData.category_id;
    
    setIsFormValid(!hasValidationErrors && !requiredFieldsMissing);
  }, [validationErrors, formData]);

  // Function to validate title
  const validateTitle = (title: string): boolean => {
    if (!title.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        title: 'Title is required'
      }));
      return false;
    }
    
    if (title.length > 255) {
      setValidationErrors(prev => ({
        ...prev,
        title: 'Title must be less than 255 characters'
      }));
      return false;
    }
    
    // Check for potentially malicious content in title
    const suspiciousPattern = /<script|javascript:|onerror=|onclick=|onload=|\(\)|eval\(|alert\(/i;
    if (suspiciousPattern.test(title)) {
      setValidationErrors(prev => ({
        ...prev,
        title: 'Title contains potentially unsafe content'
      }));
      return false;
    }
    
    // Clear error if valid
    setValidationErrors(prev => ({...prev, title: undefined}));
    return true;
  };

  // Function to validate URL format and security
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        url: 'URL is required'
      }));
      return false;
    }
    
    try {
      // Check if URL is valid
      const parsed = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setValidationErrors(prev => ({
          ...prev,
          url: 'Only HTTP and HTTPS URLs are allowed'
        }));
        return false;
      }

      // Check for excessively long URLs
      if (url.length > 2048) {
        setValidationErrors(prev => ({
          ...prev,
          url: 'URL is too long (max 2048 characters)'
        }));
        return false;
      }
      
      // Clear error if valid
      setValidationErrors(prev => ({...prev, url: undefined}));
      return true;
    } catch (e) {
      setValidationErrors(prev => ({
        ...prev,
        url: 'Please enter a valid URL'
      }));
      return false;
    }
  };

  // Function to check for potential script injection in description
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

  // Function to validate category selection
  const validateCategory = (categoryId: string): boolean => {
    if (!categoryId) {
      setValidationErrors(prev => ({
        ...prev,
        category_id: 'Please select a category'
      }));
      return false;
    }
    
    // Verify that the selected category exists in our options
    const categoryExists = categories.some(cat => cat.id.toString() === categoryId);
    if (!categoryExists) {
      setValidationErrors(prev => ({
        ...prev,
        category_id: 'Selected category is invalid'
      }));
      return false;
    }
    
    // Clear error if valid
    setValidationErrors(prev => ({...prev, category_id: undefined}));
    return true;
  };

  // Function to validate all fields at once (for form submission)
  const validateAll = (): boolean => {
    const titleValid = validateTitle(formData.title);
    const urlValid = validateUrl(formData.url);
    const descriptionValid = validateDescription(formData.description);
    const categoryValid = validateCategory(formData.category_id);
    
    return titleValid && urlValid && descriptionValid && categoryValid;
  };

  return {
    validationErrors,
    isFormValid,
    validateTitle,
    validateUrl,
    validateDescription,
    validateCategory,
    validateAll
  };
}