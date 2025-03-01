import { createSystemMessageTaot } from '../src/message';

describe('createSystemMessageTaot', () => {
  it('should include the original system message', () => {
    const originalMessage = 'You are a helpful assistant.';
    const result = createSystemMessageTaot(originalMessage);
    
    expect(result).toContain(originalMessage);
  });
  
  it('should include instructions for tools', () => {
    const result = createSystemMessageTaot('Test');
    
    expect(result).toContain('user\'s question matches a tool');
    expect(result).toContain('JSON object');
  });
  
  it('should include the JSON schema', () => {
    const result = createSystemMessageTaot('Test');
    
    expect(result).toContain('"tool"');
    expect(result).toContain('"args"');
    expect(result).toContain('"required"');
  });
});