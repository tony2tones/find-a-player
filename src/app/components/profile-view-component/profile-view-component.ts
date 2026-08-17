import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Profile } from '../../types/types';

@Component({
  selector: 'app-profile-view-component',
  imports: [],
  templateUrl: './profile-view-component.html',
  styleUrl: './profile-view-component.css',
})
export class ProfileViewComponent {
  @Input() profile: Partial<Profile> | null = null;
  @Output() isEdit = new EventEmitter<boolean>();

  onEditClick() {
    this.isEdit.emit(true);
  }
}
