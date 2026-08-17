import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Profile } from '../../types/types';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile-component',
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile-component.html',
})
export class UserProfileComponent implements OnChanges {
  @Input() profile: Partial<Profile> | null = null;
  @Output() closed = new EventEmitter<void>();
  fb = inject(FormBuilder);
  playerService = inject(PlayerService);
  toastService = inject(ToastrService);

  profileForm = this.fb.nonNullable.group({
    name: [''],
    last_name: [''],
    age: [0],
    location: this.fb.nonNullable.group({
      city: [''],
      country: [''],
    }),
    skill_level: this.fb.nonNullable.group({
      overall: [0],
    }),
  })

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile']) {
      this.profileForm.patchValue({
        name: this.profile?.name ?? '',
        last_name: this.profile?.last_name ?? '',
        age: this.profile?.age ?? 0,
        location: {
          city: this.profile?.location?.city ?? '',
          country: this.profile?.location?.country ?? '',
        },
        skill_level: {
          overall: this.profile?.skill_level?.overall ?? 0,
        },
      });
    }
  }

  submit() {
    if(this.profileForm.valid) {
      const { name, last_name, age, location, skill_level } = this.profileForm.getRawValue();
      const userProfile = { name, last_name, age, location, skill_level };
      this.playerService.updateUserProfile(userProfile).subscribe((data) => {
        if(!data.success){
          this.toastService.error('Failed to update profile');
        } else {
          this.toastService.success('Profile updated successfully', data.message);
          this.closed.emit();
        }
      });
    }
  }
}
