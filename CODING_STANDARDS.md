# DALILI Project Coding Standards

## Code Consistency Guidelines

### 1. Code Structure
- Use consistent indentation (4 spaces)
- Follow the established file structure pattern
- Maintain consistent naming conventions across all files
- Use TypeScript for type safety and better code maintainability

### 2. Component Patterns
- Follow the established component structure:
  ```typescript
  // Component structure
  import { ... } from '...';
  
  interface Props {
    // Props definition
  }
  
  export const ComponentName: React.FC<Props> = ({ ... }) => {
    // Component logic
    return (
      // JSX
    );
  };
  ```

### 3. API Integration
- Use the established API client pattern
- Follow consistent error handling
- Maintain uniform response types

### 4. State Management
- Use consistent state management patterns
- Follow established data flow patterns
- Maintain uniform action/reducer structure

## Command Execution Guidelines

### Important Note on Command Execution
- **NEVER** use `&&` to chain commands in PowerShell
- Instead, use separate commands or PowerShell's semicolon `;` operator
- For multiple commands, execute them separately

### Correct Command Execution Examples:
```powershell
# Correct way to run multiple commands
npm install
npm run build

# Or using PowerShell semicolon
npm install; npm run build

# For running in sequence
npm run build; if ($?) { npm start }
```

### Incorrect Command Execution Examples:
```powershell
# DO NOT use this pattern
npm install && npm run build  # This will cause syntax errors in PowerShell
```

## Best Practices

1. **Code Organization**
   - Keep related code together
   - Follow the established directory structure
   - Maintain consistent file naming

2. **Error Handling**
   - Use consistent error handling patterns
   - Follow the established error logging approach
   - Maintain uniform error messages

3. **Testing**
   - Follow the established testing patterns
   - Maintain consistent test file structure
   - Use uniform testing utilities

4. **Documentation**
   - Follow consistent documentation patterns
   - Maintain uniform comment style
   - Keep documentation up to date

## Review Process

1. **Code Review Checklist**
   - Verify code follows established patterns
   - Check for consistent naming
   - Ensure proper error handling
   - Validate command execution patterns

2. **Testing Requirements**
   - All new code must have tests
   - Follow established testing patterns
   - Maintain consistent test coverage

## Maintenance

1. **Regular Updates**
   - Keep dependencies up to date
   - Follow consistent update patterns
   - Maintain uniform versioning

2. **Performance**
   - Follow established optimization patterns
   - Maintain consistent performance standards
   - Use uniform monitoring approaches

Remember: Consistency is key to maintaining a high-quality codebase. Always follow these standards to ensure the project remains maintainable and scalable.

## AI-Friendly Code Patterns

### 1. Code Complexity Management
- Keep functions small and focused (max 30-40 lines)
- Use clear, descriptive function and variable names
- Avoid deeply nested conditionals (max 3 levels)
- Break complex logic into smaller, well-named functions
- Use early returns to reduce nesting

### 2. Type Safety and Documentation
- Always use TypeScript interfaces for data structures
- Document complex business logic with clear comments
- Use JSDoc comments for function parameters and return types
- Avoid using `any` type - use proper type definitions
- Use enums for fixed sets of values

### 3. State Management Clarity
- Keep state management simple and predictable
- Use clear action names and types
- Document state shape and transformations
- Avoid complex state dependencies
- Use immutable state updates

### 4. Error Handling Patterns
- Use consistent error types
- Implement proper error boundaries
- Log errors with sufficient context
- Handle edge cases explicitly
- Use type guards for runtime checks

### 5. Code Organization for AI Understanding
- Group related functionality together
- Use consistent file naming patterns
- Keep file structure flat when possible
- Use clear module boundaries
- Document complex algorithms step by step

### 6. Testing and Validation
- Write tests for edge cases
- Use type checking in tests
- Implement proper input validation
- Test error scenarios explicitly
- Use consistent test naming patterns

### 7. Performance Considerations
- Avoid premature optimization
- Document performance-critical code
- Use proper caching strategies
- Implement proper loading states
- Handle large datasets appropriately

### 8. Security Best Practices
- Validate all user inputs
- Implement proper authentication checks
- Use secure data handling patterns
- Follow OWASP security guidelines
- Document security considerations

Remember: The goal is to maintain code that is both human-readable and AI-friendly. Complex patterns should be documented and explained thoroughly to ensure consistent understanding and implementation.

## AI Agent Configuration Settings

### Recommended AI Settings
- **Temperature**: 0.2-0.3
  - Lower temperature for code generation (more deterministic)
  - Higher temperature (0.4-0.6) only for creative tasks like documentation
  - Never use temperature > 0.7 for code generation

- **Top P**: 0.1-0.2
  - Lower values for more focused and consistent outputs
  - Helps prevent hallucinations in code generation

- **Frequency Penalty**: 0.1
  - Helps prevent repetitive code patterns
  - Maintains code diversity while staying consistent

- **Presence Penalty**: 0.1
  - Encourages exploration of different solutions
  - Prevents getting stuck in local patterns

### Context Window Management
- Keep context windows focused and relevant
- Include only necessary files and documentation
- Maintain clear file references
- Use clear section markers in prompts

### Prompt Engineering Guidelines
1. **Code Generation Prompts**
   - Be specific about requirements
   - Include relevant context
   - Specify expected patterns
   - Reference existing code examples

2. **Documentation Prompts**
   - Specify documentation style
   - Include relevant context
   - Reference existing documentation

3. **Review Prompts**
   - Specify review criteria
   - Include relevant standards
   - Reference existing patterns

### Best Practices for AI Interaction
1. **Code Generation**
   - Break down complex tasks into smaller steps
   - Provide clear requirements
   - Include relevant context
   - Specify expected patterns

2. **Code Review**
   - Focus on specific aspects
   - Reference coding standards
   - Include relevant context
   - Specify review criteria

3. **Documentation**
   - Provide clear structure
   - Include relevant context
   - Specify documentation style
   - Reference existing documentation

### Error Prevention
1. **Code Generation**
   - Use lower temperature settings
   - Provide clear requirements
   - Include relevant context
   - Specify expected patterns

2. **Code Review**
   - Use moderate temperature settings
   - Focus on specific aspects
   - Include relevant context
   - Reference coding standards

3. **Documentation**
   - Use higher temperature settings
   - Provide clear structure
   - Include relevant context
   - Specify documentation style

Remember: These settings are guidelines and may need adjustment based on specific tasks and requirements. Always monitor AI outputs and adjust settings as needed. 