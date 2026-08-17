import { inject, Injectable } from '@angular/core';
import { Supabase } from '../supabase';
import { AuthService } from '../auth-service';
import { catchError, finalize, from, map, of, switchMap, tap } from 'rxjs';
import { Profile } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  supabase = inject(Supabase);
  authService = inject(AuthService);
  loading = true;

  getUserProfile$() {
    return this.authService.authState.pipe(
      switchMap((session) => {
        if (!session) {
          return of(null);
        }
        this.loading = true;
        return from(
          this.supabase.supabase
            .from('profile')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle(),
        ).pipe(
          map((res) => res.data),
          tap(
            (res) => console.log(res),
            catchError((err) => {
              console.log(err);
              return of(err);
            }),
          ),
          finalize(() => (this.loading = false)),
        );
      }),
    );
  }

  updateUserProfile(userProfile: Omit<Profile, 'id' | 'created_at'>) {
    return this.authService.authState.pipe(
      switchMap((session) => {
        if (!session) {
          return of({ success: false, message: 'You must be logged in.' });
        }
        this.loading = true;
        const userId = session.user.id;
        return from(
          this.supabase.supabase
            .from('profile')
            .upsert({ ...userProfile, id: userId })
            .select()
            .maybeSingle(),
        ).pipe(
          map(({ error }) => {
            if (error) {
              return { success: false, message: error.message };
            }
            return { success: true, message: '' };
          }),
          catchError(() =>
            of({
              success: false,
              message: 'Something went wrong, please try again.',
            }),
          ),
          finalize(() => (this.loading = false)),
        );
      }),
    );
  }
}
