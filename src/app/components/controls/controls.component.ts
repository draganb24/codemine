import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent {
  searchText = signal<string>('');
  pageSize = signal<number>(5);

  pageSizes: number[] = [5, 10, 20, 50];

  @Output() searchTextChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();

  onSearchTextChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText.set(target.value);
    this.filterProducts();
  }

  filterProducts(): void {
    this.searchTextChange.emit(this.searchText());
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize.set(Number(target.value));
    this.pageSizeChange.emit(this.pageSize());
  }
}
