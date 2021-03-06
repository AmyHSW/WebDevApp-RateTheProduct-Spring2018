import { Component, OnInit } from '@angular/core';
import {SharedService} from '../../../services/shared.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product.service.client';
import {ReviewService} from '../../../services/review.service.client';
import {UserService} from '../../../services/user.service.client';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: String;
  product: any;
  reviews: any;
  isReviewer: boolean;
  hasReviewed: boolean;
  isObserver: boolean;
  isFavorite: boolean;
  noUser: boolean;
  user : any;
  userId: String;
  favorites = [];
  length: Number;
  reviewPage: any;
  pages = [];
  isAdmin: boolean;
  deleteFlag: boolean;
  deleteMsg: String;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private sharedService: SharedService,
              private reviewService: ReviewService,
              private userService: UserService) { }

  ngOnInit() {
    this.deleteMsg = 'Successfully deleted review!';
    this.activatedRoute.params.subscribe(
      (params: any) => {
        this.productId = params['productId'];
        this.reviewPage = params['reviewPage'];
        this.productService.findProductById(this.productId).subscribe(
          (product: any) => {
            this.product = product;
          }
        );
        this.reviewService.findAllReviewsForProduct(this.productId).subscribe(
          (reviews: any) => {
            this.reviews = reviews;
            for (let i = 0; i < Math.ceil(this.reviews.length / 5); i++) {
              this.pages[i] = i;
              console.log(this.pages);
            }
            this.userService.loggedIn().subscribe(
              (isLoggedIn) => {
                this.noUser = !isLoggedIn;
                this.user = this.sharedService.user;
                this.userId = this.user['_id'];
                this.isReviewer = (this.user['type'] === 'REVIEWER');
                this.isObserver = (this.user['type'] === 'OBSERVER');
                this.isAdmin = (this.user['type'] === 'ADMIN');
                if (this.isObserver) {
                  this.userService.findFavoritesForUser(this.userId).subscribe(
                    (data: any) => {
                      this.favorites = data;
                      // console.log(this.favorites);
                      for (const favorite of this.favorites) {
                        if (favorite['_id'] === this.productId) {
                          this.isFavorite = true;
                          break;
                        }
                      }
                    }
                  );
                } else if (this.isReviewer) {
                  for (let review of this.reviews) {
                    if (review._user._id === this.userId) {
                      this.hasReviewed = true;
                      break;
                    }
                  }
                }
              }
            );
          }
        );
      }
    );

  }

  clickFavoriteButton() {
    console.log(this.isFavorite);
    console.log(this.isFavorite === true);
    if (this.isFavorite) {
      this.userService.deleteFavorite(this.userId, this.productId).subscribe(
        (data: any) => {
          alert('successfully delete from favorite');
          this.isFavorite = false;
        }
      );
    } else {
      console.log(this.userId, this.productId);
      this.userService.addFavorite(this.userId, this.productId).subscribe();
      this.isFavorite = true;
      alert('successfully add to favorite');
    }
  }

  deleteReview(reviewId) {
    this.reviewService.deleteReview(reviewId)
      .subscribe(
        (data: any) => {
          this.deleteFlag = true;
          this.reviewService.findAllReviewsForProduct(this.productId).subscribe(
            (reviews: any) => {
              this.reviews = reviews;
              for (let i = 0; i < Math.ceil(this.reviews.length / 5); i++) {
                this.pages[i] = i;
              }
            })
        }
      )
  }
}
