import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { GameControlsService } from 'src/app/service/game-controls.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChildren('tryArea') tryArea!: QueryList<ElementRef>;

  tryCounter!: number;
  tries!: number[];
  currentWord!: string;
  isFetching!: boolean;

  constructor(private gameControl: GameControlsService) {
    this.gameControl.isFetching$.subscribe((isFetching) => {
      this.isFetching = isFetching;
    });
  }

  ngOnInit(): void {
    this.gameControl
      .getRemainingTries()
      .subscribe((tryCounter) => (this.tryCounter = tryCounter));
    this.tries = this.gameControl.getNumberOfTries();
    this.gameControl.getCurrentWord().subscribe((word) => {
      this.currentWord = word;
    });
  }

  ngAfterViewInit(): void {
    this.gameControl.setTryArea(this.tryArea);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (
      !this.gameControl.isAnimating &&
      !this.gameControl.isFetching$.getValue() &&
      !this.gameControl.hasWon
    ) {
      if (this.gameControl.isKeyValid(event.key)) {
        this.gameControl.processKey(event.key);
      }
    }
  }
}
