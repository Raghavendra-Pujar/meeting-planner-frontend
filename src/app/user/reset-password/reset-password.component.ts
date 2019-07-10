import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public password;
  public confirmPassword;
  public authToken;

  constructor(public api: ApiService,public router: Router,public route: ActivatedRoute) { }

  ngOnInit() {
    this.authToken = this.route.snapshot.queryParamMap.get('authToken');
    console.log(this.authToken);
  }

  public resetPassword =()=>{

  if(!this.password){
    Swal.fire({
      title:'Fill out the password field',
      position: 'top-right',
      type:'error',
      toast: true
    })

  }else if(!this.confirmPassword){
    Swal.fire({
      title:'Fill out the confirm Password field',
      position: 'top-right',
      type:'error',
      toast: true
    })

  }else if(this.password != this.confirmPassword)
    {
      Swal.fire({
        title:'Passwords didnot match',
        position: 'top-right',
        type:'error',
        toast: true
      })
    }else{
    this.api.resetPassword(this.authToken,this.password).subscribe((apiResponse:any)=>{
      console.log(apiResponse)
      if(apiResponse.status === 200){
        Swal.fire({
          title:'Password Updated',
          type:'success',
          toast: true,
          position: 'top-right'
        })
        this.router.navigate(['/login']);
      }else{
        Swal.fire({
          title:apiResponse.message,
          type:'error',
          toast: true,
          position: 'top-right'
        })
      }
    })
  }
}

}
