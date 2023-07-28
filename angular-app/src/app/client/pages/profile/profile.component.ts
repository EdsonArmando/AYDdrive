import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { userInfo } from 'src/interface/user.interface';
import { twoFAFactory } from './factoryMethod/2fa';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  loading = false;
  id: string = '';
  nombre: string = '';
  password: string = '';
  conf_password: string = '';
  fechaNac: string = '';
  correo: string = '';
  usuario: string = '';
  autenticacion: any = false;
  telefono: any = 0;
  modificable: string = "si";
  loadingState: boolean = false;
  mensaje: string = '';
  twoFA: twoFAFactory = new twoFAFactory();

  constructor(
    public user_service: UserService,
    public router: Router,
    public toastr: ToastrService
  ) {
    if(localStorage.length === 0){
      this.router.navigate(['/auth/signin']);
    } else {
      this.loading = true;
    }
  }

  ngOnInit(): void {
    const Usuario = this.user_service.get_storage_user();
    this.id = Usuario.id;
    this.nombre = Usuario.nombre;
    this.password = this.user_service.decrypt(Usuario.contra);
    this.fechaNac = Usuario.fechaNac;
    this.correo = Usuario.correo;
    this.usuario = Usuario.usuario;
    this.conf_password = this.user_service.decrypt(this.password);
    this.autenticacion = Usuario.autenticacion;
    this.telefono = Usuario.telefono === 0 ? '' : Usuario.telefono;
    if(!this.autenticacion){
      this.correo = Usuario.correo === '' ? this.twoFA.getDefaultCorreo().getCorreo() : Usuario.correo;
      this.telefono = Usuario.telefono === 0 ? this.twoFA.getDefaultTelefono().getTelefono() : Usuario.telefono;
      console.log(this.twoFA.getDefaultCorreo());
      console.log(this.twoFA.getDefaultTelefono());
    }
  }

  registrar() {
    this.loadingState = true;
    this.mensaje = '';

    if (
      this.nombre != '' &&
      this.password != '' &&
      this.conf_password != '' &&
      this.fechaNac != ''
    ) {
      if (this.conf_password == this.password) {
        this.user_service
          .edit_user(
            this.id,
            this.nombre,
            this.password,
            this.correo,
            this.fechaNac,
            this.autenticacion,
            this.telefono == '' ? 0 : this.telefono,
            this.modificable
          )
          .subscribe((res: any) => {
            if (res['estado'] == 1) {
              this.toastr.success('Usuario editado con exito!');
              this.user_service.unstorage_user();
              let data_user:userInfo = {
                id: this.id,
                nombre: this.nombre,
                usuario: this.usuario,
                contra: this.user_service.encrypt(this.password),
                correo: this.correo,
                fechaNac: this.fechaNac,
                autenticacion: this.autenticacion,
                telefono: this.telefono
              };
              this.user_service.storage_user(data_user);
              this.router.navigate(['/client/home']);
            } else if (res['estado'] == 0) {
              this.mensaje =
                '* Error al editar el usuario, revisa tus datos por favor.';
              this.loadingState = false;
            }
          });
      } else {
        this.mensaje = '* Las contraseñas no coinciden.';
        this.loadingState = false;
      }
    } else {
      this.mensaje = '* No has completado todos los campos.';
      this.loadingState = false;
    }
  }
}
