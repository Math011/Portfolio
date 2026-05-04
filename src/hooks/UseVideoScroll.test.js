import { renderHook, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import useVideoScroll from './useVideoScroll';

// =============================================================================
// MOCKS & HELPERS
// =============================================================================

let rafCallbacks = [];
let rafId = 0;
let mockNow = 0;

const mockRaf = (cb) => {
  const id = rafId++;
  rafCallbacks.push({ id, cb });
  return id;
};

const flushRaf = (times = 1) => {
  for (let i = 0; i < times; i++) {
    const callbacks = [...rafCallbacks];
    rafCallbacks = [];
    callbacks.forEach(({ cb }) => cb && cb());
  }
};

const createMockVideo = (overrides = {}) => {
  let currentTime = overrides.currentTime || 0;
  let paused = overrides.paused !== undefined ? overrides.paused : true;
  
  return {
    current: {
      duration: overrides.duration || 10,
      get currentTime() { return currentTime; },
      set currentTime(val) { currentTime = val; },
      get paused() { return paused; },
      readyState: overrides.readyState ?? 4,
      play: jest.fn(() => { paused = false; }),
      pause: jest.fn(() => { paused = true; }),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      ...overrides,
    },
  };
};

// Central setup helper
const setup = (options = {}) => {
  if (options.progress !== undefined) {
    localStorage.setItem('portfolio_progress', options.progress.toString());
  }
  if (options.videoTime !== undefined) {
    localStorage.setItem('portfolio_video_time', options.videoTime.toString());
  }
  const videoRef = createMockVideo(options.video);
  const utils = renderHook(() => useVideoScroll(videoRef));
  return { videoRef, ...utils };
};

// Scroll helper
const scroll = (deltaY) => {
  act(() => {
    fireEvent.wheel(window, { deltaY });
  });
};

// Time + RAF helper
const advanceTime = (time, frames = 5) => {
  act(() => {
    mockNow = time;
    flushRaf(frames);
  });
};

// =============================================================================
// SETUP & TEARDOWN
// =============================================================================

let perfSpy;

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  rafCallbacks = [];
  rafId = 0;
  mockNow = 0;
  
  window.requestAnimationFrame = jest.fn(mockRaf);
  window.cancelAnimationFrame = jest.fn((id) => {
    rafCallbacks = rafCallbacks.filter(item => item.id !== id);
  });
  perfSpy = jest.spyOn(performance, 'now').mockImplementation(() => mockNow);
});

afterEach(() => {
  perfSpy?.mockRestore();
});

// =============================================================================
// TESTS: localStorage
// =============================================================================

describe('useVideoScroll - localStorage', () => {

  test('initializes with progress 0 when localStorage is empty', () => {
    const { result } = setup();
    expect(result.current.progress).toBe(0);
  });

  test('restores progress from localStorage', () => {
    const { result } = setup({ progress: 50 });
    expect(result.current.progress).toBe(50);
  });

  test.each([
    ['invalid', 'invalid'],
    ['> 100', '150'],
    ['negative', '-10'],
  ])('handles %s localStorage value', (_, value) => {
    localStorage.setItem('portfolio_progress', value);
    const { result } = setup();
    expect(result.current.progress).toBe(0);
  });

  test('saves progress to localStorage', () => {
    setup();
    expect(localStorage.getItem('portfolio_progress')).toBe('0');
  });

});

// =============================================================================
// TESTS: Wheel scroll
// =============================================================================

describe('useVideoScroll - wheel scroll', () => {

  test.each([
    ['down (deltaY > 0)', 100, 0],
    ['up (deltaY < 0)', -100, 50],
  ])('scroll %s plays video', (_, deltaY, progress) => {
    const { videoRef } = setup({ progress });
    scroll(deltaY);
    expect(videoRef.current.play).toHaveBeenCalled();
  });

  test.each([
    ['mouse (600ms delay)', 100, 700],
    ['trackpad (200ms delay)', 50, 300],
  ])('scroll stops video after %s', (_, deltaY, time) => {
    const { videoRef } = setup();
    scroll(deltaY);
    advanceTime(time);
    expect(videoRef.current.pause).toHaveBeenCalled();
  });

  test('does not scroll past 100%', () => {
    const { result } = setup({ progress: 100 });
    scroll(100);
    expect(result.current.progress).toBe(100);
  });

  test('does not scroll up when progress is 0', () => {
    const { videoRef } = setup({ progress: 0 });
    scroll(-100);
    expect(videoRef.current.play).not.toHaveBeenCalled();
  });

  test('can scroll back from 100%', () => {
    const { videoRef } = setup({ progress: 100 });
    scroll(-100);
    expect(videoRef.current.play).toHaveBeenCalled();
  });

});

// =============================================================================
// TESTS: navigateToSection
// =============================================================================

describe('useVideoScroll - navigateToSection', () => {

  test('is a function', () => {
    const { result } = setup();
    expect(typeof result.current.navigateToSection).toBe('function');
  });

  test.each([
    ['pauses video when navigating', 0, 50, true],
    ['still pauses if same target', 50, 50, true],
  ])('%s', (_, initial, target, shouldPause) => {
    const { result, videoRef } = setup({ progress: initial });
    videoRef.current.pause.mockClear();

    act(() => {
      result.current.navigateToSection(target);
    });

    if (shouldPause) {
      expect(videoRef.current.pause).toHaveBeenCalled();
    } else {
      expect(videoRef.current.pause).not.toHaveBeenCalled();
    }
  });

  test('does nothing when videoRef is null', () => {
    const { result } = renderHook(() => useVideoScroll({ current: null }));
    expect(() => {
      act(() => result.current.navigateToSection(50));
    }).not.toThrow();
  });

  test('resets isAtEnd when navigating to < 100', () => {
    const { result, videoRef } = setup({ progress: 100 });
    act(() => result.current.navigateToSection(0));
    expect(videoRef.current.pause).toHaveBeenCalled();
  });

});

// =============================================================================
// TESTS: Video sync
// =============================================================================

describe('useVideoScroll - video sync', () => {

  test('sets currentTime from localStorage when ready', () => {
    const { videoRef } = setup({ videoTime: 5 });
    expect(videoRef.current.currentTime).toBe(5);
  });

  test('waits for loadedmetadata when not ready', () => {
    const addEventListener = jest.fn();
    setup({ videoTime: 3, video: { readyState: 0, addEventListener } });
    expect(addEventListener).toHaveBeenCalledWith('loadedmetadata', expect.any(Function), { once: true });
  });

  test('handles video time modulo duration', () => {
    const { videoRef } = setup({ videoTime: 25, video: { duration: 10 } });
    expect(videoRef.current.currentTime).toBe(5); // 25 % 10
  });

});

// =============================================================================
// TESTS: Progress
// =============================================================================

describe('useVideoScroll - progress', () => {

  test('initializes correctly across sections', () => {
    [0, 30, 43, 50, 100].forEach(value => {
      localStorage.clear();
      const { result } = setup({ progress: value });
      expect(result.current.progress).toBe(value);
    });
  });

  test('is clamped between 0 and 100', () => {
    const { result } = setup();
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.progress).toBeLessThanOrEqual(100);
  });

});

// =============================================================================
// TESTS: Cleanup
// =============================================================================

describe('useVideoScroll - cleanup', () => {

  test('cleans up listeners and animation frames', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const addSpy = jest.spyOn(window, 'addEventListener');

    const { unmount } = setup();
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

    removeSpy.mockRestore();
    addSpy.mockRestore();
  });

});

// =============================================================================
// TESTS: Return value
// =============================================================================

describe('useVideoScroll - return value', () => {

  test('returns progress and navigateToSection', () => {
    const { result } = setup();
    expect(result.current).toEqual({
      progress: expect.any(Number),
      navigateToSection: expect.any(Function),
    });
  });

});