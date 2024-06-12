import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Query,
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

  constructor(private gameControl: GameControlsService) {}

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

  resetBoard() {
    this.tryArea.forEach(console.log);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameControl.isKeyValid(event.key)) {
      this.gameControl.processKey(event.key);
    }
  }
}
