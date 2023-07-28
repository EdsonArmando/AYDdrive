import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  headers:HttpHeaders = new HttpHeaders({
    'Content-Type':'application/json'
  });
  
  prefijo_url = 'http://35.232.111.58:3010?api=';


  // Subir Archivo
  subir_archivo(filename:string, contenido:string, base64:string){
    const url = this.prefijo_url + 'archivos&id=subir';
    return this.http.post(url, {
      'ruta': 'http://35.232.111.58:3005/subirArchivo',
      'NOMBRE': filename,
      'CONTENIDO': contenido,
      'BASE64': base64
    }, {headers: this.headers}
    ).pipe(map( data => data ));
  }

  // Crear un archivo
  crear_archivo(nombre:string, id_carpeta:string, url_archivo:string){
    const url = this.prefijo_url + 'archivos&id=crear';
    return this.http.post(url, {
      'ruta': 'http://35.232.111.58:3005/createArchivo',
      'NOMBRE': nombre,
      'ID_CARPETA': id_carpeta,
      'URL': url_archivo
    }, {headers: this.headers}
    ).pipe(map( data => data ));
  }

  // Listar archivos
  listar_archivos(id_carpeta:string){
    const url = this.prefijo_url + 'archivos&id=listado';

    return this.http.post(url, {
      'ruta': 'http://35.232.111.58:3005/ListadoArchivos',
      'ID_CARPETA': id_carpeta
    }, {headers: this.headers}
    ).pipe(map( data => data ));
  }

  // Eliminar archivo
  delete_archivo(id_archivo:string, url_archivo:string){
    const url = this.prefijo_url + 'archivos&id=eliminar';

    return this.http.post(url, {
      'ruta': 'http://35.232.111.58:3005/borrarArchivo',
      'ID_ARCHIVO': id_archivo,
      'URL': url_archivo
    }, {headers: this.headers}
    ).pipe(map( data => data ));
  }
  
  propierdas_archivo(id_carpeta:string, id_archivo:string){
    const url = this.prefijo_url + 'archivos&id=especifico';

    return this.http.post(url, {
      'ruta': 'http://35.232.111.58:3005/archivoEspecifico',
      'ID_CARPETA': id_carpeta,
      'ID_ARCHIVO': id_archivo
    }, {headers: this.headers}
    ).pipe(map( data => data ));
  }

  mover_archivo(carpeta_destino:string, id_archivo:string){
    const url = this.prefijo_url + 'archivos&id=mover';
    return this.http.post(url, {
      'ruta': 'http://35.232.111.58:3005/MoverArchivo',
      'ID_CARPETA_DESTINO': carpeta_destino,
      'ID_ARCHIVO': id_archivo
    }, {headers: this.headers}
    ).pipe(map( data => data ));
  }

  enviar_contenido(id_usuario: string, id_archivo: string){
    const url = this.prefijo_url + 'archivos&id=enviar'
    return this.http.post(url, {
      'ruta': 'http://35.232.111.58:3005/enviarContenido',
      'idArchivo': id_archivo,
      'idUsuario': id_usuario
    }, {headers: this.headers}
    ).pipe(map( data => data ));
  }
}
