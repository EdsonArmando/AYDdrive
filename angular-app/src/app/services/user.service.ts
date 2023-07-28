import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { userInfo } from '../../interface/user.interface';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  tokenFromUI: string = "0123456789123456";
  static instance: UserService;
  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    UserService.instance = this;
   }

    headers:HttpHeaders = new HttpHeaders({
      'Content-Type':'application/json'
    });

    prefijo_url = 'http://35.232.111.58:3010?api=';
    //
    singleton(){
      console.log("Usando Singleton");
    }
    // GENERAR CODIGO
    generarCodigo(id:string){
      const url = 'http://35.232.111.58:3000/generarCodigo/' + id;
      return this.http.get(url,
      ).pipe(map( data => data ));
    }

    // VERIFICAR CODIGO
    verificarCodigo(id:string, codigoTelefono:any, codigoCorreo:string){
      const url = 'http://35.232.111.58:3000/verificarCodigo';
      return this.http.post(url,{
        'id': id,
        'codigoTelefono': codigoTelefono === 0 ? "": codigoTelefono,
        'codigoCorreo': codigoCorreo
      }
      ).pipe(map( data => data ));
    }

    // CREAR USUARIO
    create_user(username:string, nombre:string, password:string, correo:string, fechanacimiento:string){
      const url = this.prefijo_url + 'usuarios&id=crear';

      return this.http.post(url, {
        'ruta': 'http://35.232.111.58:3000/crearUsuario',
        'usuario': username,
        'nombre': nombre,
        'contra': this.encrypt(password),
        'correo': correo,
        'fechaNac': fechanacimiento,
        'autenticacion': false,
        'telefono': 0
      }, {headers: this.headers}
      ).pipe(map( data => data ));
    }

    // LOGIN USUARIO
    login_user(username:string, password:string){      
      const url = this.prefijo_url + 'usuarios&id=login';

      return this.http.post(url, {
        'ruta': 'http://35.232.111.58:3000/login',
        'usuario': username,
        'contra': this.encrypt(password)
      }, { headers: this.headers }
      ).pipe(map( data => data ));
    }

    // EDITAR USUARIO
    edit_user(id:string, name:string, password:string, correo:string, fechaNac:string, autenticacion: boolean, telefono: number, modificable:string){
      const url = this.prefijo_url + 'usuarios&id=actualizar';
      console.log("Usando Factory Method");
      return this.http.put(url, {
        'ruta': 'http://35.232.111.58:3000/actualizarPerfil/'+id,
        'nombre': name,
        'correo': correo,
        'contra': this.encrypt(password),
        'fechaNac': fechaNac,
        'autenticacion': autenticacion,
        'telefono': telefono,
        'modificable': modificable
      }, {headers: this.headers}
      ).pipe(map(data => data));
    }

    // VER DATOS DEL USUARIO - Plantilla
    read_user(id:string){
      const url = this.prefijo_url + 'read';

      return this.http.post(url, {
        'id': id
      }, { headers: this.headers }
      ).pipe(map(data => data));
    }

    // GUARDAR USUARIO EN LOCAL STORAGE
    storage_user(user:userInfo){
      let user_string = JSON.stringify(user);
      localStorage.setItem('UserLog', user_string);
    }

    // ELIMINAR USUARIO DE LOCAL STORAGE
    unstorage_user(){
      localStorage.removeItem('UserLog');
      localStorage.clear();
    }

    // EXTRAER USUARIO DE LOCAL STORAGE
    get_storage_user(){
      let current_user = localStorage.getItem('UserLog');
      if ( current_user != null ) {
        let user_json = JSON.parse(current_user);
        return user_json;
      } else {
        return null;
      }
    }

    // CREAR CARPETA 
    create_carpeta(name:string, user:string){
      const url = this.prefijo_url + 'carpetas&id=crear';

      return this.http.post(url, {
        'ruta': 'http://35.232.111.58:3001/crearCarpeta/',
        'nombre': name,
        'propietario': user
      }, {headers: this.headers}
      ).pipe(map( data => data ));
    }

    // VER CARPETAS
    read_carpetas(id:string){
      const url = this.prefijo_url + 'carpetas&id=obtener';
      return this.http.post(url, {
        'ruta': 'http://35.232.111.58:3003/obtenerCarpetas/'+id
      }, {headers: this.headers}
      ).pipe(map( data => data ));

    }

    // ELIMINAR CARPETA
    delete_carpeta(id:string){
      const url = this.prefijo_url + 'carpetas&id=eliminar';

      return this.http.post(url, {
        'ruta': 'http://35.232.111.58:3002/eliminarCarpeta/'+id
      }, {headers: this.headers}
      ).pipe(map( data => data ));
    }

    // EDITAR CARPETA
    edit_carpeta(id:string, nuevo:string, viejo:string){
      const url = this.prefijo_url + 'carpetas&id=editar';

      return this.http.put(url, {
        'ruta': 'http://35.232.111.58:3003/editarCarpeta',
        'nuevo': nuevo,
        'viejo': viejo,
        'propietario': id
      }, {headers: this.headers}
      ).pipe(map(data => data));
    }

    // VER PAPELERA
    read_papelera(id:string){
      const url = 'http://35.232.111.58:3004/obtenerPapelera/' + id;
      return this.http.get(url,
      ).pipe(map( data => data ));
    }

    // MOVER A PAPELERA
    moverAPapelera(id:string){
      const url = 'http://35.232.111.58:3004/moverAPapelera/' + id;
      return this.http.delete(url,
      ).pipe(map( data => data ));
    }

    // ELIMINAR PERMANENTE
    eliminarPermanente(id:string){
      const url = 'http://35.232.111.58:3004/eliminarCompleto/' + id;
      return this.http.delete(url,
      ).pipe(map( data => data ));
    }

    // RESTAURAR
    restaurarArchivo(id:string){
      const url = 'http://35.232.111.58:3004/restaurarArchivo/' + id;
      return this.http.put(url,{}
      ).pipe(map( data => data ));
    }

    encrypt(value : string) {
      let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
      let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
      let encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(value), _key, {
          keySize: 16,
          iv: _iv,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
      return encrypted.toString();
    }
    decrypt(textToDecrypt : string) {
      let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
      let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
  
      let respose = CryptoJS.AES.decrypt(
        textToDecrypt, _key, {
          keySize: 16,
          iv: _iv,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
      return respose.slice(1, -1);
    }

}
