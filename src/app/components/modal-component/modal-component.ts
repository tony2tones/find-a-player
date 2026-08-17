import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-component',
  imports: [CommonModule],
  templateUrl: './modal-component.html',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() modalTitle = 'Title';
  @Output() closeMe = new EventEmitter<void>();

  closeModal(){
    this.closeMe.emit();
  }
}
