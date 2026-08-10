import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState = new BehaviorSubject<Session | null>(null);

  constructor(private supabase:Supabase) {
    this.supabase.supabase.auth.onAuthStateChange((event, session) => {
      this.authState.next(session);
    })
  }

  login(credentials:{email: string, password: string}) {
    this.supabase.supabase.auth.signInWithPassword(credentials).then(({ data: { user,session}, error})  =>  {
    }).catch((e) => {
      console.log(e)
    })
  }

  register(credentials: {email:string, password: string}) {
    this.supabase.supabase.auth.signUp(credentials).then(({ data: { user, session}, error}) => {
    }).catch((e => console.log(e)))
  }

}
