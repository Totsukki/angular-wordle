import { Component, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapArrowRepeat,
  bootstrapMoonFill,
  bootstrapQuestion,
  bootstrapSunFill,
} from '@ng-icons/bootstrap-icons';
import { GameControlsService } from 'src/app/service/game-controls.service';
import { ModalService } from 'src/app/service/modal.service';

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
  isFetching = false;
  constructor(
    private gameControl: GameControlsService,
    private modalService: ModalService
  ) {
    this.gameControl.isFetching$.subscribe((isFetching) => {
      this.isFetching = isFetching;
    });
  }

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

  showHowToPlayModal() {
    this.modalService.setTitle('How to Play');
    this.modalService.setContent('');
    this.modalService.onToggleModal();
  }
}
