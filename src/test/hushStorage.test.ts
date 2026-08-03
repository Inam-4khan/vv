import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  parseLocalStorage,
  setLocalStorage,
  isHushNote,
  isHushNoteArray,
} from '../utils/storage';
import { HushNote } from '../../types';

describe('hushStorage / parseLocalStorage helper tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const sampleNote: HushNote = {
    id: 'note-1',
    userId: 'user-1',
    username: 'ghost_runner',
    avatar: 'https://picsum.photos/seed/ghost/100',
    text: 'A secret whisper in the void',
    timestamp: '2 mins ago',
  };

  const sampleDefaultNotes: HushNote[] = [
    {
      id: 'default-1',
      userId: 'user-0',
      username: 'system',
      avatar: 'https://picsum.photos/seed/sys/100',
      text: 'Default secret note',
      timestamp: 'Just now',
    },
  ];

  it('returns default value when localStorage key is missing', () => {
    const result = parseLocalStorage(
      'hush_all_notes',
      isHushNoteArray,
      sampleDefaultNotes
    );
    expect(result).toEqual(sampleDefaultNotes);
  });

  it('returns parsed value when stored value is valid JSON and passes validator', () => {
    const validNotes = [sampleNote];
    setLocalStorage('hush_all_notes', validNotes);

    const result = parseLocalStorage(
      'hush_all_notes',
      isHushNoteArray,
      sampleDefaultNotes
    );
    expect(result).toEqual(validNotes);
    expect(result).toHaveLength(1);
    expect(result[0]?.text).toBe('A secret whisper in the void');
  });

  it('returns default value and warns when stored value fails type validation', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Store array with missing required fields (invalid HushNote)
    const invalidNotes = [{ id: '123', invalidKey: true }];
    localStorage.setItem('hush_all_notes', JSON.stringify(invalidNotes));

    const result = parseLocalStorage(
      'hush_all_notes',
      isHushNoteArray,
      sampleDefaultNotes
    );

    expect(result).toEqual(sampleDefaultNotes);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('failed type validation')
    );
  });

  it('returns default value and logs error when stored value is corrupted JSON', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    localStorage.setItem('hush_all_notes', '{{corrupted_json_string--!!');

    const result = parseLocalStorage(
      'hush_all_notes',
      isHushNoteArray,
      sampleDefaultNotes
    );

    expect(result).toEqual(sampleDefaultNotes);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('validates single HushNote using isHushNote type guard', () => {
    expect(isHushNote(sampleNote)).toBe(true);
    expect(isHushNote(null)).toBe(false);
    expect(isHushNote({ id: '1' })).toBe(false);
  });
});
