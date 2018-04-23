import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../../services/product.service.client';
import {SharedService} from '../../../services/shared.service';
import {UserService} from '../../../services/user.service.client';
import {ActivatedRoute} from "@angular/router";
import {ReviewService} from "../../../services/review.service.client";
import {WalmartService} from "../../../services/walmart.service.client";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: [any];
  noUser: boolean;
  user = {};
  userId: String;
  isAdmin: boolean;
  searchText: string;
  walmartProducts: [any];
  constructor(private productService: ProductService,
              private sharedService: SharedService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private walmartService: WalmartService) { }

  ngOnInit() {
    this.isAdmin = this.sharedService.user['type'] == 'ADMIN';
    this.activatedRoute
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.searchText = params['searchText'] || '';
        if (this.searchText === '') {
          this.productService.findAllProduct().subscribe(
            (products) => {
              products.sort((a, b): number => {
                return b.reviews.length - a.reviews.length;
              });
              this.products = products;
            }
          );
        } else {
          this.productService.findProductsByProductName(this.searchText).subscribe(
            (products) => {
              this.products = products;
            }
          );
        }
      });
    this.userService.loggedIn().subscribe(
      (isLoggedIn) => {
        this.noUser = !isLoggedIn;
        console.log(this.noUser);
        if (!this.noUser) {
          this.user = this.sharedService.user;
          this.userId = this.user['_id'];
          console.log(this.noUser, this.userId);
        }
      }
    );
  }


  searchProducts() {
    this.productService.findProductsByProductName(this.searchText).subscribe(
      (products) => {
      products.sort((a, b): number => {
          return b.reviews.length - a.reviews.length;
        });
        this.products = products;
      }
    );


    this.walmartProducts = this.walmartService.searchProducts(this.searchText)['items'];
  }

  addFavorite(productId) {
    this.userService.addFavorite(this.userId, productId);
    alert('successfully add to favorite');
  }

}
