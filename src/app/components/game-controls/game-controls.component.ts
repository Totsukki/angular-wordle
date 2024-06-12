import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapArrowRepeat,
  bootstrapMoonFill,
  bootstrapQuestion,
  bootstrapSunFill,
} from '@ng-icons/bootstrap-icons';
import { WordService } from 'src/app/service/word.service';
import { GameControlsService } from 'src/app/service/game-controls.service';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [
    provideIcons({
      bootstrapArrowRepeat,
      bootstrapQuestion,
      bootstrapSunFill,
      bootstrapMoonFill,
    }),
  ],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
})
export class GameControlsComponent implements OnInit {
  isDarkMode = JSON.parse(localStorage.getItem('isDarkMode') ?? 'false');

  constructor(private gameControl: GameControlsService) {}
  ngOnInit(): void {
    this.isDarkMode
      ? document.body.classList.add('dark-mode')
      : document.body.classList.remove('dark-mode');
  }

  switchMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
    this.isDarkMode
      ? document.body.classList.add('dark-mode')
      : document.body.classList.remove('dark-mode');
  }
  onResetGame(el: Event): void {
    const target = el.target as HTMLElement;
    target.blur();
    this.gameControl.resetGame();
  }
}
