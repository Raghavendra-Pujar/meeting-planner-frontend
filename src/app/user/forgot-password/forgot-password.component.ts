import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import Swal from 'sweetalert2';
import { positionElements } from 'positioning';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public email;
  public alertFlag=false;
  public submit=true;

  constructor(public api:ApiService) { }

  ngOnInit() {
  }

  public forgotPassword = () =>{
    console.log("Reached Forgot-Password");
    this.api.forgotPassword(this.email).subscribe((apiResponse:any)=>{
      if(apiResponse.status === 200){
        console.log(apiResponse);
        this.alertFlag = true;
        this.submit= false;
      }else{
        Swal.fire(
          apiResponse.message,
          'top-right',
          'error',
          
        )
      }
    })

  }

}
