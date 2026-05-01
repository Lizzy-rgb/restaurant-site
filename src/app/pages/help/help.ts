import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class Help {
  message = '';
}
