import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { restaurantName } from '../../../app.config';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authenticationService = inject(Auth);
  name = restaurantName;

  firstName = computed(() => {
    const displayName = this.authenticationService.currentUser()?.displayName;
    return displayName ? displayName.split(' ')[0] : '';
  });

  
}
