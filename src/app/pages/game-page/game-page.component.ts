import { Component } from '@angular/core';
import { BoardComponent } from 'src/app/components/board/board.component';
import { GameControlsComponent } from 'src/app/components/game-controls/game-controls.component';
import { KeyboardComponent } from 'src/app/components/keyboard/keyboard.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [BoardComponent, GameControlsComponent, KeyboardComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent {}
