import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

// help us to intercept all outgoing requests - like middleware in node.js but for outgoing instead of incoming requests
@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      // we add the token as a header with key authorization to our outgoing request
      // set does not overwrite all headers, but adds or or, if the key exists, updates its value
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }

}
