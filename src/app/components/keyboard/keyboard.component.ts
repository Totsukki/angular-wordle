import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  bootstrapArrowReturnLeft,
  bootstrapBackspace,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { Subscription } from 'rxjs';
import { Letter } from 'src/app/models/letter.model';
import { GameControlsService } from 'src/app/service/game-controls.service';
import { WordService } from 'src/app/service/word.service';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './keyboard.component.html',
  viewProviders: [
    provideIcons({ bootstrapBackspace, bootstrapArrowReturnLeft }),
  ],
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent implements OnInit, OnDestroy {
  @ViewChildren('tryArea') tryArea!: QueryList<ElementRef>;
  keys: Letter[] = [];
  subscription!: Subscription;

  constructor(
    private wordService: WordService,
    private gameControls: GameControlsService
  ) {}

  ngOnInit(): void {
    this.subscription = this.wordService
      .getLetterList()
      .subscribe((letters$) => {
        this.keys = letters$;
      });
  }

  onKeyClick(key: string): void {
    this.gameControls.processKey(key);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
