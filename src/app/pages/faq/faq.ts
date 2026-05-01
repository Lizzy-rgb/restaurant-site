// Original Content, Feel free to revert after development
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-faq',
//   standalone: true,
//   imports: [],
//   templateUrl: './faq.html',
//   styleUrl: './faq.css'
// })
// export class Faq {}

// Debug stuff, Feel free to delete after development
import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  authenticationService = inject(Auth);
  user = this.authenticationService.currentUser();
}
