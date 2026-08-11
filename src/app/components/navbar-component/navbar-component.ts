import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  authState = inject(AuthService);
  router = inject(Router);
  
  navLinks = [
    { id: 1, name: 'Login', route: '/login' },
    { id: 2, name: 'Sign Up', route: '/signup' },
  ];

  logout() {
    this.authState.logout();
    this.router.navigate(['login']);
  }
}
