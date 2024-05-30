import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Letter } from '../models/letter.model';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private letterList = new BehaviorSubject<Letter[]>([
    { letter: 'Q', existsInWord: null },
    { letter: 'W', existsInWord: null },
    { letter: 'E', existsInWord: null },
    { letter: 'R', existsInWord: null },
    { letter: 'T', existsInWord: null },
    { letter: 'Y', existsInWord: null },
    { letter: 'U', existsInWord: null },
    { letter: 'I', existsInWord: null },
    { letter: 'O', existsInWord: null },
    { letter: 'P', existsInWord: null },
    { letter: 'A', existsInWord: null },
    { letter: 'S', existsInWord: null },
    { letter: 'D', existsInWord: null },
    { letter: 'F', existsInWord: null },
    { letter: 'G', existsInWord: null },
    { letter: 'H', existsInWord: null },
    { letter: 'J', existsInWord: null },
    { letter: 'K', existsInWord: null },
    { letter: 'L', existsInWord: null },
    { letter: 'Z', existsInWord: null },
    { letter: 'X', existsInWord: null },
    { letter: 'C', existsInWord: null },
    { letter: 'V', existsInWord: null },
    { letter: 'B', existsInWord: null },
    { letter: 'N', existsInWord: null },
    { letter: 'M', existsInWord: null },
  ]);

  getLetterList = () => this.letterList.asObservable();
  setLetterExistsInWord = (letter: string, isExisting: boolean) => {
    const currentValue = this.letterList.getValue();
    const letterIndex = currentValue.findIndex(
      (currentIndex) => currentIndex.letter === letter
    );
    currentValue[letterIndex].existsInWord = isExisting;
    this.letterList.next(currentValue);
  };
}
