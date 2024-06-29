import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './shared/components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, GamePageComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'wordle-clone';
}
