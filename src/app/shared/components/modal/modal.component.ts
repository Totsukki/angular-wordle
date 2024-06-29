import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  bootstrapLightbulbFill,
  bootstrapXLg,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { GameControlsService } from 'src/app/service/game-controls.service';
import { ModalService } from 'src/app/service/modal.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  imports: [CommonModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      bootstrapXLg,
      bootstrapLightbulbFill,
    }),
  ],
  styleUrl: './modal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit {
  title!: string;
  content!: string;
  isVisible: boolean = false;

  @ViewChild('modal') modal!: ElementRef;

  constructor(
    private modalService: ModalService,
    private gameService: GameControlsService
  ) {
    this.title = this.modalService.title;
    this.content = this.modalService.content;
    const hasAccessed = !localStorage.getItem('accessDate');
    this.isVisible = hasAccessed;
    this.modalService.onToggleModal(hasAccessed);
    localStorage.setItem('accessDate', JSON.stringify(new Date()));
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.modalService.isVisible$.subscribe((isVisible) => {
      this.isVisible = isVisible;
      this.title = this.modalService.title;
      this.content = this.modalService.content;
      if (this.modalService.title === 'Congratulations!') {
        this.celebrate();
      }
    });
  }
  onToggle(isVisible?: boolean): void {
    this.modal.nativeElement.classList.add('fade-out');
    setTimeout(() => {
      this.modalService.setContent('');
      this.modalService.setTitle('How to Play');
      this.modalService.onToggleModal(isVisible ?? !this.isVisible);
    }, 480);
  }

  onPlayAgain(): void {
    this.gameService.resetGame();
    this.onToggle(false);
  }

  celebrate() {
    const duration = 3000; // in milliseconds

    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
    });

    // Clear confetti after a certain duration
    setTimeout(() => confetti.reset(), duration);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onToggle(false);
    }
  }
}
