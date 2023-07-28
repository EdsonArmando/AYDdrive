import { single } from "rxjs/operators";
import { Router } from '@angular/router';
import { UserService } from '../../../src/app/services/user.service';
import { userInfo } from '../../interface/user.interface';
import { ToastrService } from 'ngx-toastr';

export class User { 
    public  name: string;
    public user_service : UserService;
    public router: Router;
    public toastr: ToastrService;
    public static single: User;
    log : any =true;
    constructor() {
        this.name = "Edson";        
    }
    
    public  getName(){
        return this.name;
    }
    public login(username:string,password:string){           
        if(username != '' && password != ''){            
            UserService.instance.login_user(username, password).subscribe((res:any) => {
              if(res['estado'] == 1){
                this.log = true;
                let data_user:userInfo = res['idUsuario'];
                UserService.instance.storage_user(data_user);
                if(data_user.autenticacion){
                  UserService.instance.generarCodigo(data_user.id).subscribe((res:any) => {
                    console.log(res);
                  });            
                }else{
                  this.log = true;                  
                  //alert('Has iniciado sesión correctamente.');                        
                  //this.router.navigate(['/client/home']);
                }
              } else {
                //alert('* Revisa tus credenciales, error al iniciar sesión');
                this.log = false;  
                //this.loadingState = false;
              }
            });
          } else {
            //this.mensaje = '* No has llenado los campos';
            //this.loadingState = false;                 
        }           
        return this.log;
    }
    public static getInstance(){
        if(this.single == null){
            this.single = new User();
            console.log("No existe la instancia");
        }
        console.log("Existe la instancia");
        return this.single;
    }
}