import { Component, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapArrowRepeat,
  bootstrapQuestion,
} from '@ng-icons/bootstrap-icons';
import { WordService } from 'src/app/service/word.service';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ bootstrapArrowRepeat, bootstrapQuestion })],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
})
export class GameControlsComponent implements OnInit {
  constructor(private wordService: WordService) {}
  ngOnInit(): void {
    this.wordService.setLetterExistsInWord('A', true);
  }
}
