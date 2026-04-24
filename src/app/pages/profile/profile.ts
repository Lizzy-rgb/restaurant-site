import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  email = '';
  newPassword = '';
  confirmPassword = '';
  street = '';
  city = '';
  state = '';
  zip = '';
}
