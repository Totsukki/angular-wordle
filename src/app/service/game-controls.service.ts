import {
  ElementRef,
  Injectable,
  QueryList,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import { WordService } from './word.service';
import { Letter } from '../models/letter.model';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class GameControlsService {
  private tryArea$ = new BehaviorSubject<QueryList<ElementRef>>(
    new QueryList<ElementRef>()
  );
  private renderer: Renderer2;
  tries = [1, 2, 3, 4, 5, 6];
  // tries = [1];
  tips = [
    "Start with a common word: Begin with a five-letter word that uses common letters like 'SLATE', 'CRANE', or 'ADIEU'.",
    'Use vowels early: Include at least two vowels in your starting word to quickly identify which vowels are in the solution.',
    'Avoid repeating letters initially: Ensure your first guess has no repeating letters to maximize the number of different letters you test.',
    'Look for patterns: Pay attention to common letter combinations and word patterns.',
    'Use process of elimination: If a letter turns gray, avoid using it in future guesses.',
    'Mix up letter positions: Try moving known letters to different positions to discover the correct placement.',
    'Think of common prefixes and suffixes: Consider common beginnings and endings of words.',
    "Don't ignore the clues: Use the yellow (present but wrong position) and green (correct position) letters effectively.",
    'Keep a list of possible words: Write down potential solutions and eliminate them as you go.',
    "Practice makes perfect: The more you play, the better you'll get at recognizing patterns and common words.",
  ];

  tryCounter$ = new BehaviorSubject<number>(0);
  currentWord$ = new BehaviorSubject<string>('');
  gameWord$ = new BehaviorSubject<string>('');
  splittedWord!: string[];

  wordCheckStatus: Letter[] = [];

  isWordExisting = false;
  isAnimating = false;
  isFetching$ = new BehaviorSubject<boolean>(false);
  hasWon = false;

  constructor(
    private rendererFactory: RendererFactory2,
    private wordService: WordService,
    private modalService: ModalService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.getNewWord();
    this.tryCounter$.subscribe((tries) => {
      if (tries === this.tries.length && !this.hasWon) {
        this.modalService.setTitle('Better luck next time!');
        this.modalService.setContent(
          'Correct word: ' +
            this.currentWord$.getValue() +
            '\n' +
            this.tips[Math.ceil(Math.random() * this.tips.length - 1)]
        );
        this.modalService.onToggleModal(true);
      }
    });
  }

  setTryArea(tryArea$: QueryList<ElementRef>): void {
    this.tryArea$.next(tryArea$);
  }

  isKeyValid(key: string): boolean {
    return /^[a-zA-Z]$/.test(key) || key === 'Enter' || key === 'Backspace';
  }

  async processKey(key: string): Promise<void> {
    this.splittedWord = this.gameWord$.getValue().split('');
    if (key === 'Enter') {
      const hasTries = this.tryCounter$.getValue() < this.tries.length;
      const isFilled =
        this.gameWord$.getValue().length ===
        this.currentWord$.getValue().length;

      if (hasTries && isFilled) {
        const isValidWord = await this.checkWord();
        if (this.checkIfWon()) {
          this.modalService.setTitle('Congratulations!');
          this.modalService.setContent('You guessed the word!');
          this.modalService.onToggleModal(true);
          this.hasWon = true;
          return;
        }

        if (isFilled && isValidWord) {
          this.tryCounter$.next(this.tryCounter$.getValue() + 1);
          this.gameWord$.next('');
          this.splittedWord = [];
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
      this.gameWord$.next(this.gameWord$.getValue() + upperCasedKey);
      const selectedDiv = divElements[this.gameWord$.getValue().length - 1];
      const letter = this.renderer.createElement('b');
      this.renderer.setProperty(letter, 'textContent', upperCasedKey);
      this.renderer.addClass(letter, 'letter');
      this.renderer.addClass(selectedDiv, 'pop');
      this.renderer.appendChild(selectedDiv, letter);
    }
  };
  private removeLetter = (divElements: NodeList[]) => {
    if (this.gameWord$.getValue().length > 0) {
      this.gameWord$.next(
        this.gameWord$.getValue().slice(0, this.gameWord$.getValue().length - 1)
      );
      const currentDiv = divElements[this.gameWord$.getValue().length];
      this.renderer.setProperty(currentDiv, 'textContent', '');
      this.renderer.removeClass(currentDiv, 'pop');
    }
  };

  checkIfWon() {
    let correctCount = 0;
    this.wordCheckStatus.forEach((status) => {
      if (status.matchingStatus === 'correct') {
        correctCount++;
      }
    });
    return correctCount === this.currentWord$.getValue().length;
  }
  async checkWord() {
    this.isAnimating = true;
    const currentWord = this.currentWord$.getValue();
    const wordValue = this.gameWord$.getValue();
    const tryCounterValue = this.tryCounter$.getValue();
    const tryAreaValue = this.tryArea$.getValue();
    const isWordValid = await firstValueFrom(
      this.wordService.checkWordIfExists(wordValue)
    );
    this.wordCheckStatus = [];
    const currentDiv = tryAreaValue.toArray()[tryCounterValue].nativeElement;

    if (isWordValid) {
      currentWord.split('').forEach((letter, i) => {
        let matchingStatus = '';
        if (letter === wordValue[i]) {
          matchingStatus = 'correct';
        } else if (
          currentWord
            .split('')
            .findIndex((letter) => letter === wordValue[i]) >= 0
        ) {
          matchingStatus = 'exists';
        } else {
          matchingStatus = 'wrong';
        }
        this.wordCheckStatus.push({
          letter: wordValue[i],
          matchingStatus,
        });
      });

      return new Promise((resolve, reject) => {
        const div = tryAreaValue.find(
          (div) => div.nativeElement.id == tryCounterValue + 1
        );
        if (div) {
          const children = Array.from(currentDiv.children);
          const childPromises = children.map((child, i) => {
            return new Promise((childResolve) => {
              setTimeout(() => {
                this.renderer.addClass(child, 'tumble');
                setTimeout(() => {
                  this.renderer.addClass(
                    child,
                    this.wordCheckStatus[i].matchingStatus || ''
                  );
                  childResolve(true);
                }, 100);
              }, i * 500);
            });
          });
          Promise.all(childPromises).then(() => {
            setTimeout(() => {
              this.wordCheckStatus.forEach((wordCheck) => {
                this.wordService.setLetterExistsInWord(
                  wordCheck.letter,
                  wordCheck.matchingStatus || ''
                );
              });
              this.isAnimating = false;
              resolve(true);
            }, 200);
          });
        } else {
          reject(new Error('error'));
        }
      });
    } else {
      this.renderer.addClass(currentDiv, 'shake');
      setTimeout(() => {
        this.renderer.removeClass(currentDiv, 'shake');
      }, 200);
      this.isAnimating = false;
      return false;
    }
  }

  resetGame() {
    this.hasWon = false;
    this.tryCounter$.next(0);
    this.gameWord$.next('');
    this.wordService.resetLettersData();
    this.wordCheckStatus = [];
    this.splittedWord = [];
    this.getNewWord();
    this.resetBoard();
  }

  resetBoard() {
    const currentBoard = this.tryArea$.getValue();
    currentBoard.forEach((div, i) => {
      const parentDivNativeEl = div.nativeElement;
      i === 0
        ? this.renderer.addClass(parentDivNativeEl, 'currently')
        : this.renderer.removeClass(parentDivNativeEl, 'currently');
      const children = Array.from(div.nativeElement.children);
      children.forEach((child) => {
        this.renderer.removeAttribute(child, 'class');
        this.renderer.setProperty(child, 'textContent', '');
      });
    });
  }

  getNewWord() {
    this.isFetching$.next(true);
    this.wordService.getCurrentWord().subscribe((word) => {
      this.currentWord$.next(word[0].toUpperCase());
      this.isFetching$.next(false);
    });
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
