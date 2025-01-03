import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetAllProductResponse, Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:7098/products'; 

  constructor(private http: HttpClient) {}

  getAll(pageIndex : number , pageSize : number) {
    return this.http.get<GetAllProductResponse>(`${this.apiUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`).toPromise(); 
  }

  getById(id: number){
    return this.http.get<Product>(`${this.apiUrl}/${id}`).toPromise();
}

  add(product: Product) {
    return this.http.post<void>(this.apiUrl, product).toPromise(); 
  }

  update(id: number, product: Product){
    return this.http.put<void>(`${this.apiUrl}/${id}`, product).toPromise(); 
  }


  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).toPromise(); 
  }
}