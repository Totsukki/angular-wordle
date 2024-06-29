import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  title = 'How to Play';
  content = '';
  isVisible$ = new BehaviorSubject<boolean>(false);

  setTitle(title: string): void {
    this.title = title;
  }

  setContent(content: string): void {
    this.content = content;
  }

  onToggleModal(visible?: boolean) {
    this.isVisible$.next(visible ?? !this.isVisible$.getValue());
  }
}
