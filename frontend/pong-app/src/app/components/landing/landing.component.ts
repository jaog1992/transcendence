import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  
  constructor(private router: Router) {}
  
  login42(): void {
    // Display loading screen (communication happens through service)
    const loadingScreenElement = document.querySelector('.loading-screen') as HTMLElement;
    if (loadingScreenElement) {
      loadingScreenElement.style.display = 'flex';
    }
    
  // Redirigir a la URL de autorización del backend Django
  window.location.href = 'http://localhost:8000/auth/authorize/';

    // Navigate to home after delay
   // setTimeout(() => {
   //   if (loadingScreenElement) {
   //     loadingScreenElement.style.display = 'none';
   //   }
   //   this.router.navigate(['/home']);
   // }, 2000);
  }
}