import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
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

  isWordFourLetter = Math.random() < 0.5;

  constructor(private http: HttpClient) {}

  getLetterList = () => this.letterList.asObservable();

  setLetterExistsInWord = (letter: string, matchStatus: string) => {
    const currentValue = this.letterList.getValue();
    const letterIndex = currentValue.findIndex(
      (currentIndex) => currentIndex.letter === letter.toUpperCase()
    );
    if (currentValue[letterIndex].matchingStatus !== 'correct') {
      currentValue[letterIndex].matchingStatus = matchStatus;
      this.letterList.next(currentValue);
    }
  };

  getCurrentWord(): Observable<string[]> {
    return this.http
      .get<string[]>(
        `${environment.randomWordGeneratorBaseUrl}/word?number=1&length=${
          this.isWordFourLetter ? 4 : 5
        }`
      )
      .pipe(
        map((words) => words.map((word) => word.toUpperCase())),
        catchError(() => {
          if (this.isWordFourLetter) return this.getFourLetterWord();
          return this.getFiveLetterWord();
        })
      );
  }

  /**
   * Gets Current Word Length Word List
   * @description This function gets the current word length word list from the API.
   * If the API fails, it falls back to a local JSON file.
   * @returns [wordDictionaryArray. hasError]
   */
  getCurrentWordLengthWordList(): Observable<{
    words: string[];
    hasError: boolean;
    currentWordLength: number;
  }> {
    const length = this.isWordFourLetter ? 4 : 5;

    return this.http
      .get<string[]>(
        `${environment.randomWordGeneratorBaseUrl}/word?number=9999&length=${length}`
      )
      .pipe(
        map(
          (words) => {
            const upperCaseWords = words.map((word) => word.toUpperCase());
            return {
              words: upperCaseWords,
              hasError: false,
              currentWordLength: length,
            };
          } // No error, emit words and hasError = false
        ),
        catchError(() => {
          const fallbackUrl =
            length > 4
              ? `${environment.apiBaseUrl}/fiveLetterWords`
              : `${environment.apiBaseUrl}/fourLetterWords`;

          return this.http.get<string[]>(fallbackUrl).pipe(
            map((words) => {
              const upperCaseWords = words.map((word) => word.toUpperCase());
              return {
                words: upperCaseWords,
                hasError: true,
                currentWordLength: length,
              };
            }) // On error, emit fallback words and hasError = true
          );
        })
      );
  }

  checkWordIfExists(word: string): Observable<boolean> {
    return of(localStorage.getItem('words')).pipe(
      map((words) => {
        if (words) {
          return words!.includes(word.toUpperCase());
        }
        throw new Error('No words in local storage');
      }),
      catchError(() => {
        const fallbackUrl =
          word.length > 4
            ? `${environment.apiBaseUrl}/fiveLetterWords`
            : `${environment.apiBaseUrl}/fourLetterWords`;

        return this.http.get<string[]>(fallbackUrl).pipe(
          map((words) => {
            return words.includes(word);
          }),
          catchError(() => of(false))
        );
      })
    );
  }
  resetLettersData() {
    const lettersData = this.letterList.getValue();
    lettersData.forEach((letter) => {
      letter.matchingStatus = null;
    });
    this.letterList.next(lettersData);
  }
  getFourLetterWord(): Observable<string[]> {
    const index = Math.ceil(Math.random() * 2096);
    return this.http
      .get<string[]>(
        `${environment.apiBaseUrl}/fourLetterWords?_start=${index}&_end=${
          index + 1
        }`
      )
      .pipe(map((words) => words.map((word) => word.toUpperCase())));
  }

  getFiveLetterWord(): Observable<string[]> {
    const index = Math.ceil(Math.random() * 3562);
    return this.http
      .get<string[]>(
        `${environment.apiBaseUrl}/fiveLetterWords?_start=${index}&_end=${
          index + 1
        }`
      )
      .pipe(map((words) => words.map((word) => word.toUpperCase())));
  }
}
