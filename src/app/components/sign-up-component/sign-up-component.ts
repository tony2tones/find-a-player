import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-sign-up-component',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up-component.html',
  styleUrl: './sign-up-component.css',
})
export class SignUpComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  registerForm = this.fb.nonNullable.group({
    email: ['', Validators.email],
    password: ['', Validators.minLength(4)],
  });

  onSubmit() {
    if(this.registerForm.valid) {
      const {email, password} = this.registerForm.getRawValue();
      this.authService.register({email, password});
    }
  }
}
