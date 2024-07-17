import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../../services/cart.service';
import { CartComponent } from '../../cart/cart.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapCart } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIconComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  viewProviders: [provideIcons({ bootstrapCart })]
})
export class NavbarComponent {

  constructor(private modalService: NgbModal, public cartService: CartService) {}

  openCartModal(): void {
    this.modalService.open(CartComponent);
  }

}
