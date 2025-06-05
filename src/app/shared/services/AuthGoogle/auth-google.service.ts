import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../AuthService/auth.service';
import { ToastrService } from 'ngx-toastr';

declare const google: any;

@Injectable({
    providedIn: 'root'
})
export class GoogleLoginService {
    private tokenClient: any;
    private scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.gender.read';

    constructor(private authService: AuthService, private toastr: ToastrService) { }

    initTokenClient(): void {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: environment.googleClientId,
            scope: this.scope,
            callback: (response: any) => {
                if (response.error) {
                    this.toastr.error('Token error:', response);
                    return;
                }
                this.authService.sentTokenToServer(response.access_token);
            }
        });
    }

    signInWithPopup(): void {
        if (!this.tokenClient) {
            this.initTokenClient();
        }

        this.tokenClient.requestAccessToken({
            // prompt: 'consent' 
        });
    }
}
