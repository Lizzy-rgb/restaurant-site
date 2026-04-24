import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-item-detail',
  standalone: true,
  imports: [],
  templateUrl: './menu-item-detail.html',
  styleUrl: './menu-item-detail.css'
})
export class MenuItemDetail {
  isSignedIn = false;
}