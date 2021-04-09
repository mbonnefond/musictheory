import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ScaleType } from '@tonaljs/scale-type'
import { Scale, ScaleDictionary, Note, Interval, Chord, Key, ChordDictionary } from '@tonaljs/tonal';
import { ScaleNote } from './interfaces/scale-note';
import { ComposerService } from './services/composer.service';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.css']
})

export class ComposerComponent implements OnInit {

  notesPossibles: string[];
  selectedNote: string;
  findChordNotes: string[];
  foundChord: string;
  selectedScaleType: ScaleType;
  scaleTypes: ScaleType[];
  scalePattern: number[];
  scaleNotes: ScaleNote[];
  scaleChords: string[];
  withSeventh: boolean;
  intervalleMax: number;
  chromaWidth: number;


  constructor(private composerService: ComposerService) {
    this.notesPossibles = ComposerService.notesPossibles;
    this.scaleTypes = composerService.scaleTypes;
    this.selectedScaleType = ScaleDictionary.get('major');
    this.selectedNote = 'C';
    this.scalePattern = [];
    this.scaleNotes = [];
    this.scaleChords = [];
    this.findChordNotes = ['', '', '', '', ''];
    this.foundChord = undefined;
    this.intervalleMax = 5;
    this.chromaWidth = 80;
  }

  ngOnInit(): void {
    this.onScaleTypeSelectionChange();
  }

  onScaleTypeSelectionChange(): void {
    this.updateDatasFromSelectedScale();
    // console.log('scalePattern ' + this.scalePattern);
    // console.log('scaleNotes ' + JSON.stringify(this.scaleNotes));
    // console.log('scaleChords ' + this.scaleChords);
  }

  updateDatasFromSelectedScale() {
    // Mise à jour des notes de la gamme
    this.scaleNotes = this.composerService.getNotesOfScale(this.selectedNote, this.selectedScaleType);
    // Mise à jour de l'échelle chromatique
    this.scalePattern = this.composerService.getscalePattern(this.selectedNote, this.scaleNotes);
    // Mise à jour des accords de la gamme
    this.updateScaleChords();
  }

  getChordQuality(chord: string): string {
    return Chord.get(chord).quality.toLowerCase();
  }

  onfindChordNotesChange(): void {
    this.foundChord = this.composerService.getChordFromNotes(this.findChordNotes);
  }

  onToggleEmbellishChange(change: MatButtonToggleChange) {
    this.intervalleMax = change.value;
    this.updateScaleChords();
  }

  updateScaleChords(): void {
    console.log("Update with " + this.intervalleMax + 'th');
    this.scaleChords.length = 0;
    this.composerService.getChordsOfScale(this.scaleNotes, this.intervalleMax)
      .forEach(chord => this.scaleChords.push(chord));
  }
}
