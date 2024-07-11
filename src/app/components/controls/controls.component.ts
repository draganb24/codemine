import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent {
  searchText: string = '';
  pageSize: number = 5;
  pageSizes: number[] = [5, 10, 20, 50];

  @Output() searchTextChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();

  filterProducts(): void {
    this.searchTextChange.emit(this.searchText);
  }

  onPageSizeChange(): void {
    this.pageSizeChange.emit(this.pageSize);
  }
}
