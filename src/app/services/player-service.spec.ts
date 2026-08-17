import { TestBed } from '@angular/core/testing';

import { PlayerService } from './player-service';
import { AuthService } from '../auth-service';
import { Supabase } from '../supabase';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Profile } from '../types/types';

const chainableMock = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
};
const fakeSupabase = {
  supabase: chainableMock,
};

const fakeAuthService = {
  authState: new BehaviorSubject<any>({ user: { id: 'test-user-id' } }),
};

export const mockProfile: Profile = {
  id: 'test-user-id',
  created_at: new Date().toISOString(),
  name: 'Jane',
  last_name: 'Doe',
  age: 27,
  location: { city: 'Cape Town', country: 'South Africa' },
  skill_level: { overall: 7 },
};

const chainableMockSuccess = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
};

const fakeSupabaseSuccess = {
  supabase: chainableMockSuccess,
};

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        { provide: AuthService, useValue: fakeAuthService },
        { provide: Supabase, useValue: fakeSupabase },
      ],
    });
    service = TestBed.inject(PlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users details and be null', async () => {
    const result = await firstValueFrom(service.getUserProfile$());
    expect(result).toBeNull();
  });  
});


  describe('PlayerService Success', () => {
  let service: PlayerService;
    beforeEach(() => {
      TestBed.configureTestingModule({
      providers: [
        PlayerService,
        { provide: AuthService, useValue: fakeAuthService },
        { provide: Supabase, useValue: fakeSupabaseSuccess },
      ],
    })
    service = TestBed.inject(PlayerService);
  })

    it('should pulled user data successfully', async () => {
      const result = await firstValueFrom(service.getUserProfile$())
      expect(result).toEqual(mockProfile)
    });
  });