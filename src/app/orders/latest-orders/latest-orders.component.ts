import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-latest-orders',
  templateUrl: './latest-orders.component.html',
  styleUrls: ['./latest-orders.component.scss']
})
export class LatestOrdersComponent implements OnInit {
  latestOrders: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadLatestOrders();
  }

  loadLatestOrders() {
    this.orderService.getLatestOrders().subscribe(data => {
      this.latestOrders = data;
    });
  }
}
