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
import { AuthGuard } from './core/guards/auth-guard';
import { staffGuard } from './core/guards/staff-guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'menu', component: Menu, title: 'Menu' },
  { path: 'menu/:name', component: MenuItemDetail, title: 'Edit Item' },
  { path: 'my-order', component: MyOrder, title: 'My Order', canActivate: [AuthGuard] },
  { path: 'sign-in', component: SignIn, title: 'Sign In' },
  { path: 'register', component: Register, title: 'Register' },
  { path: 'profile', component: Profile, title: 'Profile', canActivate: [AuthGuard] },
  { path: 'settings', component: Settings, title: 'User Settings', canActivate: [AuthGuard] },
  { path: 'help', component: Help, title: 'Contact Us', canActivate: [AuthGuard] },
  { path: 'faq', component: Faq, title: 'Frequently Asked Questions' },
  {
    path: 'active-orders',
    component: ActiveOrders,
    title: 'Active Orders',
    //canActivate: [staffGuard],
  },
  { path: '**', redirectTo: '' },
];
