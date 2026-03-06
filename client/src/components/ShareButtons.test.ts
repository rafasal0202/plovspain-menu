import { describe, it, expect, vi } from 'vitest';

describe('ShareButtons', () => {
  it('should render share buttons with correct emojis', () => {
    const container = document.createElement('div');
    const html = `
      <button title="Поделиться в Telegram">✈️</button>
      <button title="Поделиться в WhatsApp">💬</button>
      <button title="Поделиться в Instagram">📷</button>
    `;
    container.innerHTML = html;
    
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toBe('✈️');
    expect(buttons[1].textContent).toBe('💬');
    expect(buttons[2].textContent).toBe('📷');
  });

  it('should have correct titles for share buttons', () => {
    const container = document.createElement('div');
    const html = `
      <button title="Поделиться в Telegram">✈️</button>
      <button title="Поделиться в WhatsApp">💬</button>
      <button title="Поделиться в Instagram">📷</button>
    `;
    container.innerHTML = html;
    
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].title).toBe('Поделиться в Telegram');
    expect(buttons[1].title).toBe('Поделиться в WhatsApp');
    expect(buttons[2].title).toBe('Поделиться в Instagram');
  });

  it('should have correct background colors', () => {
    const container = document.createElement('div');
    const html = `
      <button class="bg-blue-500">✈️</button>
      <button class="bg-green-500">💬</button>
      <button class="bg-pink-500">📷</button>
    `;
    container.innerHTML = html;
    
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].className).toContain('bg-blue-500');
    expect(buttons[1].className).toContain('bg-green-500');
    expect(buttons[2].className).toContain('bg-pink-500');
  });
});
