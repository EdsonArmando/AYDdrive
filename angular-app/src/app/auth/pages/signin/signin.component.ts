import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { userInfo } from '../../../../interface/user.interface';
import { ToastrService } from 'ngx-toastr';
import { User } from  '../../../singleton/singleton.model'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  constructor(
    public user_service: UserService,
    public router: Router,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.user_service.unstorage_user();
  }

  username:string = "";
  password:string = "";

  codigoTelefono:string = "";
  codigoCorreo:string = "";

  telVisible = true;
  emailVisible = true; 

  visibleModal = false;

  loadingState:boolean = false;
  mensaje:string = "";

  login(){
    //alert(Person.getInstance().getName());
    this.loadingState = true;
    this.mensaje = "";

    if(this.username != '' && this.password != ''){
      let existe = User.getInstance().login(this.username, this.password);
      console.log(existe);
      this.user_service.login_user(this.username, this.password).subscribe((res:any) => {
        try {
          if(res['estado'] == 1){
            let data_user:userInfo = res['idUsuario'];
            this.user_service.storage_user(data_user);
            if(data_user.autenticacion){
              this.user_service.generarCodigo(data_user.id).subscribe((res:any) => {
                console.log(res);
              });
              this.visibleModal = true;
              this.telVisible = data_user.telefono === 0 ? false : true;
              this.emailVisible = data_user.correo === "" ? false : true;
            }else{
              //this.toastr.success('Has iniciado sesión correctamente.', 'Bienvenido '+ data_user.nombre +'!');
              this.router.navigate(['/client/home']);
            }
          } else {
            this.mensaje = '* Revisa tus credenciales, error al iniciar sesión';
            this.loadingState = false;
          }
        } catch (error) {
            this.mensaje = '* Revisa tus credenciales, error al iniciar sesión';
            this.loadingState = false;
        }
        
      });
    } else {
      this.mensaje = '* No has llenado los campos';
      this.loadingState = false;
    }
  }

  verificarCodigo(){
    const Usuario = this.user_service.get_storage_user();
    this.user_service.verificarCodigo(Usuario.id, this.codigoTelefono, this.codigoCorreo).subscribe((res:any) => {
      if(res['estado'] == 0){
        this.toastr.error('codigo o codigos fallidos', 'Error');
      }else if(res['estado'] == 1){
        //this.toastr.success('Has iniciado sesión correctamente.', 'Bienvenido '+ Usuario.nombre +'!');
        this.router.navigate(['/client/home']);
      }else if(res['estado'] == 2){
        this.toastr.error('tiempo superado', 'Error');
      }
    });
  }

  cambio(){
    this.loadingState = false;
    this.visibleModal = false;
  }

  reenviar(){
    const Usuario = this.user_service.get_storage_user();
    this.user_service.generarCodigo(Usuario.id).subscribe((res:any) => {
      if(res['estado'] == 1){
        this.toastr.success('Se envio un nuevo token correctamente.');
      }else{
        this.toastr.error('No se pudo enviar el token.');
      }
    });
  }

}
