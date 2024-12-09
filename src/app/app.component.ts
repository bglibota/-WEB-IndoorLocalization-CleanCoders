import { Component } from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'indoor-localization-web';
  isLoginPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/register';
      }
    });
  }
}
