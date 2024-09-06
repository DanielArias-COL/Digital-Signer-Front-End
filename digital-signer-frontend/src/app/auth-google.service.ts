import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

  constructor(private oAuthService: OAuthService) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '754956390808-e3du344li91ke9jqkako15g25i4kgp6a.apps.googleusercontent.com',
      redirectUri: 'http://localhost:4200/home/principal',
      scope: 'openid profile email'
    }

    this.oAuthService.configure(config);
    this.oAuthService.setupAutomaticSilentRefresh();

    // Intenta iniciar sesión después de cargar el documento de descubrimiento
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken() && this.oAuthService.hasValidAccessToken()) {
        console.log('Usuario autenticado');
      } else {
        console.log('El usuario no está autenticado.');
      }
    });
  }

  login() {
    this.oAuthService.initLoginFlow();
  }

  logout() {
    this.oAuthService.logOut();
  }

  getProfile() {
    return this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken() && this.oAuthService.hasValidAccessToken()) {
        return this.oAuthService.getIdentityClaims();
      }
      return null;
    });
  }
}
