import { Injectable } from '@angular/core';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product, ProductService, RoutingService } from '@spartacus/core';

@Injectable()
export class CurrentProductService {
  constructor(
    private routingService: RoutingService,
    private productService: ProductService
  ) {}

  getProduct(): Observable<Product> {
    return this.routingService.getRouterState().pipe(
      tap(state => console.log(state.state.params.name)),
      map(state => state.state.params['productCode']),
      filter(productCode => !!productCode),
      switchMap((productCode: string) => this.productService.get(productCode))
    );
  }
}
