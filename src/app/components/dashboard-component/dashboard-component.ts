import { Component, inject } from '@angular/core';
import { PlayerService } from '../../services/player-service';
import { UserProfileComponent } from '../user-profile-component/user-profile-component';
import { AsyncPipe } from '@angular/common';
import { Profile } from '../../types/types';
import { Observable } from 'rxjs';
import { ModalComponent } from '../modal-component/modal-component';
import { ProfileViewComponent } from '../profile-view-component/profile-view-component';

@Component({
  selector: 'app-dashboard-component',
  imports: [UserProfileComponent, AsyncPipe, ModalComponent, ProfileViewComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  playerService = inject(PlayerService);
  playerProfile$: Observable<Profile | null> = this.playerService.getUserProfile$();

  isModalOpen = false;

  toggleModal(state: boolean) {
    this.isModalOpen = state;
  }

}
