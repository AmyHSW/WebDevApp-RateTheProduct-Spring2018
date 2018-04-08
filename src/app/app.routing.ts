import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './views/user/login/login.component';
import {ProductListComponent} from './views/product/product-list/product-list.component';
import {ProductNewComponent} from './views/product/product-new/product-new.component';
import {ProductListBusinessComponent} from './views/product/product-list-business/product-list-business.component';
import {ProductDetailComponent} from './views/product/product-detail/product-detail.component';
import {ProductEditComponent} from './views/product/product-edit/product-edit.component';
import {ReviewListComponent} from "./views/review/review-list/review-list.component";
import {ReviewNewComponent} from "./views/review/review-new/review-new.component";
import {AuthGuard} from "./services/auth-guard.service";

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'product', component: ProductListComponent},
  {path: 'user/:userId/product', component: ProductListBusinessComponent},
  {path: 'user/:userId/product/new', component: ProductNewComponent},
  {path: 'product/:productId', component: ProductDetailComponent},
  {path: 'user/:userId/product/:productId/edit', component: ProductEditComponent},
  {path: 'product/:productId/review', component: ReviewListComponent},
  {path: 'product/:productId/review/new', component: ReviewNewComponent, canActivate: [AuthGuard]}
];

export const routing = RouterModule.forRoot(appRoutes);
