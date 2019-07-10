import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/api.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public email;
  public password;
  public fullName;
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    timer: 3000,
  })

  constructor(public api: ApiService, public router: Router, public cookieService: CookieService) { }

  ngOnInit() {
  }


  public login(): any {
    this.api.login(this.email, this.password).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse.status === 200) {
        if (apiResponse.data.userDetails.isAdmin) {
          this.Toast.fire({

            type: 'success',
            title: 'Signed in Successfully',
          })
          this.router.navigate(['/admin-dashboard'])
          this.cookieService.set('isAdmin', 'yes');
        } else {
          this.Toast.fire({

            type: 'success',
            title: 'Signed in Successfully',
          })
          this.router.navigate(['/user-dashboard'])
        }
        this.cookieService.set('authToken', apiResponse.data.authToken);
        localStorage.setItem('authToken', apiResponse.data.authToken);
        this.fullName=`${apiResponse.data.userDetails.firstName}`;
        this.cookieService.set('fullName',this.fullName);
        localStorage.setItem('fullName',this.fullName);
        this.cookieService.set('userId',apiResponse.data.userDetails.userId);
        localStorage.setItem('userId',apiResponse.data.userDetails.userId);

      }else{
        this.Toast.fire({
          type: 'error',
          title: apiResponse.message
        })
      }
    },(err)=>{
     
      this.Toast.fire({
        type: 'error',
        text: 'some error occured'
      })
    
  })
  }
}
