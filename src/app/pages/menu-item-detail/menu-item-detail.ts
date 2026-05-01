import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-menu-item-detail',
  standalone: true,
  imports: [],
  templateUrl: './menu-item-detail.html',
  styleUrl: './menu-item-detail.css',
})
export class MenuItemDetail {
  authenticationService = inject(Auth);
}
