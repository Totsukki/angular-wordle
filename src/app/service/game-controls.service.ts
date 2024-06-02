import { HttpClient } from '@angular/common/http';
import {
  ElementRef,
  Injectable,
  OnInit,
  QueryList,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Letter } from '../models/letter.model';
import { environment } from 'src/environments/environment.development';
import { WordService } from './word.service';

@Injectable({
  providedIn: 'root',
})
export class GameControlsService implements OnInit {
  private tryArea$ = new BehaviorSubject<QueryList<ElementRef>>(
    new QueryList<ElementRef>()
  );
  private renderer: Renderer2;

  tries = [1, 2, 3, 4, 5];
  // fourLetterList = ['RIPE', 'EARN', 'PILE'];
  // fiveLetterList = ['LEARN', 'PLEAD', 'CRAVE'];

  tryCounter$ = new BehaviorSubject<number>(0);
  currentWord$ = new BehaviorSubject<string>('');
  word$ = new BehaviorSubject<string>('');
  splittedWord!: string[];

  constructor(
    private rendererFactory: RendererFactory2,
    private wordService: WordService
  ) {
    // const wordList = [...this.fourLetterList, ...this.fiveLetterList];
    // this.currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.wordService.getCurrentWord().subscribe((word) => {
      this.currentWord$.next(word[0]);
    });
  }

  ngOnInit(): void {}
  setTryArea(tryArea$: QueryList<ElementRef>): void {
    this.tryArea$.next(tryArea$);
  }

  isKeyValid(key: string): boolean {
    return /^[a-zA-Z]$/.test(key) || key === 'Enter' || key === 'Backspace';
  }

  processKey(key: string): void {
    this.splittedWord = this.word$.getValue().split('');

    if (key === 'Enter') {
      const hasTries = this.tryCounter$.getValue() < this.tries.length - 1;
      const isFilled =
        this.word$.getValue().length === this.currentWord$.getValue().length;
      if (hasTries && isFilled) {
        this.checkWord();
        this.tryCounter$.next(this.tryCounter$.getValue() + 1);
        this.word$.next('');
        this.splittedWord = [];
      } else {
        if (hasTries) {
          console.log('here');
        } else {
          console.log('asdfhere');
        }
      }
    } else {
      this.tryArea$.getValue().forEach((div) => {
        if (div.nativeElement.id == this.tryCounter$.getValue() + 1) {
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
    if (this.splittedWord.length < this.currentWord$.getValue().length) {
      const upperCasedKey = key.toUpperCase();
      this.word$.next(this.word$.getValue() + upperCasedKey);
      const selectedDiv = divElements[this.word$.getValue().length - 1];
      this.renderer.setProperty(selectedDiv, 'textContent', upperCasedKey);
      this.renderer.addClass(selectedDiv, 'pop');
    }
  };

  private removeLetter = (divElements: NodeList[]) => {
    if (this.word$.getValue().length > 0) {
      this.word$.next(
        this.word$.getValue().slice(0, this.word$.getValue().length - 1)
      );
      const currentDiv = divElements[this.word$.getValue().length];
      this.renderer.setProperty(currentDiv, 'textContent', '');
      this.renderer.removeClass(currentDiv, 'pop');
    }
  };

  checkWord() {
    const currentWord = this.currentWord$.getValue();
    const word = this.word$.getValue();
    const isCorrect = currentWord === word;
    if (isCorrect) {
      console.log('correct');
    } else {
      console.log('incorrect');
    }
  }
  getRemainingTries(): Observable<number> {
    return this.tryCounter$.asObservable();
  }
  getCurrentWord(): Observable<string> {
    return this.currentWord$.asObservable();
  }
  getNumberOfTries(): number[] {
    return this.tries;
  }
}
