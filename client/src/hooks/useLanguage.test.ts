import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from './useLanguage';

describe('useLanguage hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with Russian language by default', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('ru');
  });

  it('should load language from localStorage on mount', () => {
    localStorage.setItem('language', 'es');
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('es');
  });

  it('should change language and save to localStorage', () => {
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.changeLanguage('es');
    });

    expect(result.current.language).toBe('es');
    expect(localStorage.getItem('language')).toBe('es');
  });

  it('should translate Russian key correctly', () => {
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.t('cart')).toBe('КОРЗИНА');
    expect(result.current.t('addDishesToCart')).toBe('Добавьте блюда в корзину');
  });

  it('should translate Spanish key correctly', () => {
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.changeLanguage('es');
    });

    expect(result.current.t('cart')).toBe('CARRITO');
    expect(result.current.t('addDishesToCart')).toBe('Añade platos al carrito');
  });

  it('should return key if translation not found', () => {
    const { result } = renderHook(() => useLanguage());
    const unknownKey = 'unknownKey' as any;
    
    expect(result.current.t(unknownKey)).toBe('unknownKey');
  });

  it('should persist language preference across hook instances', () => {
    const { result: result1 } = renderHook(() => useLanguage());
    
    act(() => {
      result1.current.changeLanguage('es');
    });

    const { result: result2 } = renderHook(() => useLanguage());
    expect(result2.current.language).toBe('es');
  });

  it('should handle switching between languages multiple times', () => {
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.changeLanguage('es');
    });
    expect(result.current.language).toBe('es');

    act(() => {
      result.current.changeLanguage('ru');
    });
    expect(result.current.language).toBe('ru');

    act(() => {
      result.current.changeLanguage('es');
    });
    expect(result.current.language).toBe('es');
  });
});
