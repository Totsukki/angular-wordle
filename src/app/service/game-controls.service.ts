import { HttpClient } from '@angular/common/http';
import {
  ElementRef,
  Injectable,
  OnInit,
  QueryList,
  Renderer2,
  RendererFactory2,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Letter } from '../models/letter.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GameControlsService implements OnInit {
  private tryArea = new BehaviorSubject<QueryList<ElementRef>>(
    new QueryList<ElementRef>()
  );
  private renderer: Renderer2;

  tries = [1, 2, 3, 4, 5];
  fourLetterList = ['RIPE', 'EARN', 'PILE'];
  fiveLetterList = ['LEARN', 'PLEAD', 'CRAVE'];

  tryCounter = new BehaviorSubject<number>(0);
  currentWord = '';
  word = '';
  splittedWord!: string[];

  constructor(
    private http: HttpClient,
    private rendererFactory: RendererFactory2
  ) {
    const wordList = [...this.fourLetterList, ...this.fiveLetterList];
    this.currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {}

  getFourLetterWords(): Observable<Letter[]> {
    return this.http.get<Letter[]>(`${environment.apiBaseUrl}/fourLetterWords`);
  }
  getFiveLetterWords(): Observable<Letter[]> {
    return this.http.get<Letter[]>(`${environment.apiBaseUrl}/fiveLetterWords`);
  }

  setTryArea(tryArea: QueryList<ElementRef>): void {
    this.tryArea.next(tryArea);
  }

  isKeyValid(key: string): boolean {
    return /^[a-zA-Z]$/.test(key) || key === 'Enter' || key === 'Backspace';
  }

  processKey(key: string): void {
    this.splittedWord = this.word.split('');

    if (key === 'Enter') {
      const hasTries = this.tryCounter.getValue() < this.tries.length - 1;
      const isFilled = this.word.length === this.currentWord.length;
      if (hasTries && isFilled) {
        this.tryCounter.next(this.tryCounter.getValue() + 1);
        this.word = '';
        this.splittedWord = [];
      } else {
        if (hasTries) {
          console.log('here');
        } else {
        }
      }
    } else {
      this.tryArea.getValue().forEach((div) => {
        if (div.nativeElement.id == this.tryCounter.getValue() + 1) {
          const currentDiv = div.nativeElement.children;
          if (key === 'Backspace') {
            this.removeLetter(currentDiv);
          } else {
            this.addLetter(currentDiv, key);
          }
        }
      });
    }
  }

  private addLetter = (divElements: NodeList[], key: string) => {
    if (this.splittedWord.length < this.currentWord.length) {
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
      this.renderer.setProperty(currentDiv, 'textContent', '');
      this.renderer.removeClass(currentDiv, 'pop');
    }
  };

  getRemainingTries(): Observable<number> {
    return this.tryCounter.asObservable();
  }
  getCurrentWord(): string {
    return this.currentWord;
  }
  getNumberOfTries(): number[] {
    return this.tries;
  }
}
