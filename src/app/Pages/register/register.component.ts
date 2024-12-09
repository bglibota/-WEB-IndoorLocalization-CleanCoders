import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, RouterModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  name: string = '';
  errorMessage: string = '';
  
  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    const userData = {
      username: this.username,
      password: this.password,
      name: this.name
    };

    this.authService.register(userData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        
        
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Error during registration';
      }
    );
  }
}