import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { GetAllProductResponse, Product } from './product';
import { ProductService } from './productService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
    styleUrls: ['./app.component.css']
})
export class AppComponent { 
    productDialog: boolean = false;
    products: Product[] = [];
    product!: Product;
    getAllResponse? : GetAllProductResponse; 
    selectedProducts: Product[] | null = null;
    pageIndex: number = 1;
    pageSize: number = 10;
    totalPages: number = 0;
    totalRecords : number = 0;
    submitted: boolean = false;

    constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit() {
        setTimeout(() => {
            this.getAllProducts(this.pageIndex, this.pageSize);
          }, 2000);
        
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        
        this.product = {...product};
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                    this.productService.delete(product.id!).then(() => {

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product deleted successfully!',
                            life: 1000,
                        });
                        this.getAllProducts(this.pageIndex, this.pageSize);
                        this.products = [...this.products];
                        this.productDialog = false;
                        this.product = {};
                    }).catch((err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete product. Please try again.',
                            life: 1000,
                        });
                        console.error('Error:', err);
                    });                                 
            }
        });
     
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
    
    saveProduct() {
        this.submitted = true;
       if(this.product.id! > 0){
        if (this.product.name?.trim() && this.product.description?.trim()) {
        this.productService.update(this.product.id!,this.product).then(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Updated successfully!',
                life: 1000,
            });
            this.getAllProducts(this.pageIndex, this.pageSize);
            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }).catch((err) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update product. Please try again.',
                life: 1000,
            });
            console.error('Error:', err);
        });
      } }else{
        this.product.id = 0;
        this.product.createdDate = new Date();
        if (this.product.name?.trim() && this.product.description?.trim()) {
            this.productService.add(this.product).then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product created successfully!',
                    life: 1000,
                });
                this.getAllProducts(this.pageIndex, this.pageSize);
                this.products = [...this.products];
                this.productDialog = false;
                this.product = {};
            }).catch((err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create product. Please try again.',
                    life: 1000,
                });
                console.error('Error:', err);
            });}
        }
    }
    
    getAllProducts(pageIndex: number, pageSize: number) {
        this.productService.getAll(pageIndex, pageSize).then((response) => {
            debugger;
            this.getAllResponse = response;
            this.products = this.getAllResponse?.data ?? [];
            this.totalRecords = this.getAllResponse?.count ?? 0; 
        }).catch((err) => {
            console.error('Error fetching products:', err);
        });
    }

    onPageChange(event: any) {
        this.pageIndex = event.page + 1; // Convert zero-based page to one-based index
        this.pageSize = event.rows;     // Update page size
        this.getAllProducts(this.pageIndex, this.pageSize);
    }
}
