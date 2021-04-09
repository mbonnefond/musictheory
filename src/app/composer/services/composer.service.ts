import { Injectable } from '@angular/core';
import { ScaleType } from '@tonaljs/scale-type'
import { ScaleNote } from '../interfaces/scale-note';
import { Scale, Interval, Chord } from '@tonaljs/tonal';
import { scales as scaleDictionary } from '../data/scales.json';

@Injectable({
  providedIn: 'root'
})
export class ComposerService {

  //static notesPossibles: string[] = ['C', 'Db', 'D',  'Eb', 'E', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  static notesPossibles: string[] = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'E#',
    'Fb', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'B#'];

  scaleTypes: ScaleType[];

  constructor() {
    //this.scaleTypes = ScaleDictionary.all().sort(this.sortByTypeAndName);
    this.scaleTypes = (scaleDictionary as ScaleType[]).sort(this.sortByTypeAndName);
  }


  private sortByTypeAndName(a: ScaleType, b: ScaleType): number {
    return a.name.localeCompare(b.name);
  }

  /**
   * @description retourne les notes d'une gamme en fonction du type de gamme et de la note de base de la gamme
   * @param tonality La note de base de la gamme
   * @param scaleType la gamme 
   * @returns les notes de la gamme sous la forme ScaleNote[]
   */
  getNotesOfScale(tonality: string, scaleType: ScaleType): ScaleNote[] {
    const scaleNotes = [];
    Scale.get(tonality + " " + scaleType.name).notes.forEach((note, index) => {
      scaleNotes.push({
        name: note,
        interval: Interval.num(scaleType.intervals[index]),
        intervalName: scaleType.intervals[index]
      })
    });
    scaleNotes.push({
      name: scaleNotes[0].name + '1',
      interval: 8
    });
    return scaleNotes;
  }

  /**
   * 
   * @param scaleNotes 
   * @param rootNote
   */
  getscalePattern(rootNote: string, notes: ScaleNote[]): number[] {
    let previousNote: string = rootNote;
    const scalePattern: number[] = [];
    notes.forEach((note, index) => {
      if (index > 0) {
        previousNote = notes[index - 1].name;
        const dist: number = +Interval.get(Interval.distance(previousNote, note)).semitones!;
        scalePattern.push(dist ? dist * 0.5 : NaN);
      }
    });
    return scalePattern;
  }


  getChordFromNotes(notes: string[]): string {
    const chord = Chord.detect(notes.filter(note => note !== '' && note !== undefined && note !== null));
    return chord[0];
  }

  getChordsOfScale(scaleNotes: ScaleNote[], intervalMax: number): string[] {
    let loopedNotesArray: ScaleNote[] = [];
    const chords: string[] = [];
    scaleNotes.slice(0, scaleNotes.length - 1)  // on ne veut pas le C1 de C,D,E,F,G,A,B,C1
      .forEach((note: ScaleNote) => loopedNotesArray.push(new ScaleNote(note.name, note.interval, note.intervalName)));
    scaleNotes
      .forEach((note: ScaleNote) => loopedNotesArray.push(new ScaleNote(note.name, note.interval + 7, note.intervalName)));
    let chordNotes: string[] = [];
    let chord: string;
    let max: number = (intervalMax < 5 ? 5 : intervalMax > 13 ? 13 : intervalMax)
    chords.length = 0;
    for (let scaleNoteIndex = 0; scaleNoteIndex < scaleNotes.length - 1; scaleNoteIndex++) {
      chordNotes = [];
      for (let interval = 1; interval <= max; interval += 2) {
        let note: ScaleNote = this.getScaleNoteFromIntervalNumber(loopedNotesArray, scaleNotes[scaleNoteIndex], interval);
        if (note !== undefined && note !== null) {
          chordNotes.push(note.name);
        }
      }
      chord = this.getChordFromNotes(chordNotes);
      chords.push(chord);
    }
    return chords;
  }

  getScaleNoteFromIntervalNumber(scaleNotes: ScaleNote[], rootNote: ScaleNote, intervalNumber: number): ScaleNote {
    for (let i = 0; i < scaleNotes.length; i++) {
      if (scaleNotes[i].name === rootNote.name && scaleNotes[i].interval === rootNote.interval) {
        let tmp: ScaleNote = scaleNotes.find(note => {
          let test: boolean = note.interval - scaleNotes[i].interval === intervalNumber - 1;
          return (test);
        })!;
        return tmp;
      }
    }
    return rootNote;
  }

}
