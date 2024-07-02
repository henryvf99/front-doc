import { Injectable } from '@angular/core';
import { AuthService } from '../../../shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SumarizacionService {

  constructor(
    public authService: AuthService
  ) { }
}
