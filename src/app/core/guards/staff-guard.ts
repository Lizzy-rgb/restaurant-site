import { CanActivateFn } from '@angular/router';

export const staffGuard: CanActivateFn = () => {
  return true;
};