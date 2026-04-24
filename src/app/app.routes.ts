import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { MenuItemDetail } from './pages/menu-item-detail/menu-item-detail';
import { MyOrder } from './pages/my-order/my-order';
import { SignIn } from './pages/sign-in/sign-in';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Settings } from './pages/settings/settings';
import { Help } from './pages/help/help';
import { Faq } from './pages/faq/faq';
import { ActiveOrders } from './pages/active-orders/active-orders';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { staffGuard } from './core/guards/staff-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'menu', component: Menu },
  { path: 'menu/:id', component: MenuItemDetail },
  { path: 'my-order', component: MyOrder },
  { path: 'sign-in', component: SignIn },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: 'help', component: Help },
  { path: 'faq', component: Faq },
  { path: 'active-orders', component: ActiveOrders, canActivate: [staffGuard] },
  { path: '**', component: NotFound }
];