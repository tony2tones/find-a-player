import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up-component',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up-component.html',
  styleUrl: './sign-up-component.css',
})
export class SignUpComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastr = inject(ToastrService);

  registerForm = this.fb.nonNullable.group({
    email: ['', Validators.email],
    password: ['', Validators.minLength(4)],
  });

  async onSubmit() {
    if(this.registerForm.valid) {
      const {email, password} = this.registerForm.getRawValue();
      const res = await this.authService.register({email, password});
      if(!res.success){
        this.toastr.error(res.message);
      } else {
        this.toastr.success('Sign up successful')
      }
    }
  }
}
