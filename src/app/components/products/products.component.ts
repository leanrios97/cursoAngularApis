import { Component, OnInit } from '@angular/core';

import { Product, CreateProductDTO, updateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: ''
  };

  limit = 10;
  offset = 0;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10, 0)
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductoDetail(){
    this.showProductDetail = !this.showProductDetail;
  }
  onShowDetail(id: string){
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.toggleProductoDetail();
      this.productChosen = data;
    })
  }
  createNewProduct(){
    const product: CreateProductDTO = {
      title: 'Naruto',
      description: 'el protector de la hoja en modo sabio',
      images: ['https://i.blogs.es/bc1dd2/naruto/1366_2000.png'],
      price: 1000, 
      categoryId: 2,
    }
    this.productsService.create(product)
      .subscribe(data => {
        console.log('created',data);
        this.products.unshift(data)
      });
  }

  updateProduct(){
    const change: updateProductDTO = {
      title: 'nuevo titulo',
    }
    const id = this.productChosen.id;
    this.productsService.update(id, change)
    .subscribe(data => {
      console.log('update', data)
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
    });
  }
  deleteProduct(){
    const id = this.productChosen.id;
    this.productsService.delete(id)
    .subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore(){
    this.productsService.getProductsByPage(this.limit, this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }
}
