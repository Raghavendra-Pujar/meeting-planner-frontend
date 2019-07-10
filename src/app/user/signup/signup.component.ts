import { Component, OnInit } from '@angular/core';
import {countryCodes} from '../signup/code-details/phones'
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName;
  public lastName;
  public userName;
  public email;
  public password;
  public confirmPassword;
  public mobileNumber;
  public countryCodes = countryCodes.sort((a,b)=>a.name.localeCompare(b.name));
  public selectedCode;
  public alert = Swal.mixin({
    position: 'top-right',
    toast: true,
    timer:3000
  });
 
  constructor(public api:ApiService, public router: Router) { }

  ngOnInit() {
  }


  public register=()=>{
    if(!this.firstName){
      this.alert.fire({
        title:'First Name cannot be empty',
        type: 'error'
      })
    }else if(!this.lastName){
      this.alert.fire({
        title:'Last Name cannot be empty',
        type: 'error'
      })
    }else if(!this.userName){
      this.alert.fire({
        title:'User Name cannot be empty',
        type: 'error'
      })
    }else if(!this.email){
      this.alert.fire({
        title:'Email cannot be empty',
        type: 'error'
      })
    }else if(!this.password){
      this.alert.fire({
        title:'Password cannot be empty',
        type: 'error'
      })
    }else if(!this.confirmPassword){
      this.alert.fire({
        title:'Confirm Password cannot be empty',
        type: 'error'
      })
    }else if(!this.selectedCode){
      this.alert.fire({
        title:'Country Code should be selected',
        type: 'error'
      })
    }else if(!this.mobileNumber){
      this.alert.fire({
        title:'Mobile Number cannot be empty',
        type: 'error'
      })
    }else if(this.password !== this.confirmPassword){
      this.alert.fire({
        title:'Confirm Password did not match your typed passoword',
        type: 'error'
      })
    }else{
      this.api.signup(this.firstName,this.lastName,this.userName,this.email,this.password,this.selectedCode,this.mobileNumber)
      .subscribe((apiResponse:any)=>{
        console.log(apiResponse);
        if(apiResponse.status === 200){
          this.alert.fire({
            title:'Registration Successfull',
            type: 'success'
          })
          this.router.navigate(['/login'])

        }else{
          this.alert.fire({
            title: apiResponse.message,
            type: 'error'
          })
        }
      }),((err)=>{
        this.alert.fire({
          type:'error',
          title:'some error occured!'
        })
      })
    }

  }
}
