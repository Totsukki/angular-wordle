import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Letter } from '../models/letter.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private letterList = new BehaviorSubject<Letter[]>([
    { letter: 'Q', matchingStatus: null },
    { letter: 'W', matchingStatus: null },
    { letter: 'E', matchingStatus: null },
    { letter: 'R', matchingStatus: null },
    { letter: 'T', matchingStatus: null },
    { letter: 'Y', matchingStatus: null },
    { letter: 'U', matchingStatus: null },
    { letter: 'I', matchingStatus: null },
    { letter: 'O', matchingStatus: null },
    { letter: 'P', matchingStatus: null },
    { letter: 'A', matchingStatus: null },
    { letter: 'S', matchingStatus: null },
    { letter: 'D', matchingStatus: null },
    { letter: 'F', matchingStatus: null },
    { letter: 'G', matchingStatus: null },
    { letter: 'H', matchingStatus: null },
    { letter: 'J', matchingStatus: null },
    { letter: 'K', matchingStatus: null },
    { letter: 'L', matchingStatus: null },
    { letter: 'Z', matchingStatus: null },
    { letter: 'X', matchingStatus: null },
    { letter: 'C', matchingStatus: null },
    { letter: 'V', matchingStatus: null },
    { letter: 'B', matchingStatus: null },
    { letter: 'N', matchingStatus: null },
    { letter: 'M', matchingStatus: null },
  ]);

  constructor(private http: HttpClient) {}
  getLetterList = () => this.letterList.asObservable();
  setLetterExistsInWord = (letter: string, matchStatus: number) => {
    const currentValue = this.letterList.getValue();
    const letterIndex = currentValue.findIndex(
      (currentIndex) => currentIndex.letter === letter
    );
    currentValue[letterIndex].matchingStatus = matchStatus;
    this.letterList.next(currentValue);
  };

  getCurrentWord(): Observable<string[]> {
    const isWordFourLetter = Math.random() < 0.5;
    if (isWordFourLetter) return this.getFourLetterWord();
    else return this.getFiveLetterWord();
  }

  getFourLetterWord(): Observable<string[]> {
    const index = Math.ceil(Math.random() * 2096);
    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/fourLetterWords?_start=${index}&_end=${
        index + 1
      }`
    );
  }

  getFiveLetterWord(): Observable<string[]> {
    const index = Math.ceil(Math.random() * 3562);
    return this.http.get<string[]>(
      `${environment.apiBaseUrl}/fiveLetterWords?_start=${index}&_end=${
        index + 1
      }`
    );
  }
}
