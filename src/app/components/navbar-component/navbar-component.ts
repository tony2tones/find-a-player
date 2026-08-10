import { Component } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  navLinks = [
    { id: 1, name: 'Login', route: '/login' },
    { id: 2, name: 'Sign Up', route: '/signup' },
  ];
}
