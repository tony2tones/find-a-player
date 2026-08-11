import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState = new BehaviorSubject<Session | null>(null);

  constructor(private supabase: Supabase) {
    this.supabase.supabase.auth.onAuthStateChange((event, session) => {
      this.authState.next(session);
    });
  }

  login(credentials: { email: string; password: string }) {
    return this.supabase.supabase.auth
      .signInWithPassword(credentials)
      .then(({ data: { user, session }, error }) => {
        if (error) {
          return { success: false, message: error.message };
        }
        return { success: true, message: '' };
      })
      .catch(() => {
      return { success: false, message: 'Something went wrong, please try again.' };
    });
  }

  register(credentials: { email: string; password: string }) {
    return this.supabase.supabase.auth
      .signUp(credentials)
      .then(({ data: { user, session }, error }) => {
        if (error) {
          return { success: false, message: error.message };
        }
        return { success: true, message: '' };
      })
      .catch(() => {
      return { success: false, message: 'Something went wrong, please try again.' };
    });
  }

  logout() {
    this.supabase.supabase.auth.signOut();
    this.authState.next(null);
  }
}
