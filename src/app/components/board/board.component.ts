import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  @ViewChildren('tryArea') tryArea!: QueryList<ElementRef>;

  tries = [1, 2, 3, 4, 5];
  tryCounter = 0;
  currentWordLength = 4;
  word = '';
  splittedWord!: string[];

  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {}

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isKeyValid(event.key)) {
      this.processKey(event.key);
    }
  }

  private isKeyValid(key: string): boolean {
    return /^[a-zA-Z]$/.test(key) || key === 'Enter' || key === 'Backspace';
  }

  private processKey(key: string): void {
    this.splittedWord = this.word.split('');
    this.tryArea.forEach((div) => {
      if (div.nativeElement.id == this.tryCounter + 1) {
        const currentDiv = div.nativeElement.children;
        console.log(key === 'Backspace');
        switch (key) {
          case 'Enter':
            break;
          case 'Backspace':
            console.log(key);
            this.removeLetter(currentDiv);
            break;
          default:
            this.addLetter(currentDiv, key);
            break;
        }
      }
    });
  }

  private addLetter = (divElements: NodeList[], key: string) => {
    if (this.splittedWord.length < this.currentWordLength) {
      const upperCasedKey = key.toUpperCase();
      this.word += upperCasedKey;
      const selectedDiv = divElements[this.word.length - 1];
      this.renderer.setProperty(selectedDiv, 'textContent', upperCasedKey);
      this.renderer.addClass(selectedDiv, 'pop');
    }
  };

  private removeLetter = (divElements: NodeList[]) => {
    if (this.word.length > 0) {
      this.word = this.word.slice(0, this.word.length - 1);
      const currentDiv = divElements[this.word.length];
      console.log(this.word);
      this.renderer.setProperty(currentDiv, 'textContent', '');
      this.renderer.removeClass(currentDiv, 'pop');
    }
  };
}
