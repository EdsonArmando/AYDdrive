import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ArchivosService } from 'src/app/services/archivos.service';
import { UserService } from 'src/app/services/user.service';
import { Archivo, Carpeta } from 'src/interface/user.interface';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = false;
  name: string = '';
  nameEdit: string = '';
  idEdit: string = '';
  listCarpetas: Carpeta[] = [];
  listCarpetas_ref: Carpeta[] = [];
  listArchivos: Archivo[] = [];
  cantidadarchivos: any[] = [];
  root: boolean = true;
  papelera: boolean = true;
  id_carpetavisual: string = "";
  archivo_propiedades:any = "";
  globalName = '';
  carpeta_destino = "";
  id_archivo_mover = "";
  nombrefinal_archivo = "";
  archivocargado:File | undefined;
  mover = 'Mover';
  eliminar = 'Papelera';

  constructor(private router: Router, private user_service: UserService, private toastr: ToastrService,
    private file_service: ArchivosService) {

    if(localStorage.length === 0){
      this.router.navigate(['/auth/signin']);
    } else {
      this.loading = true;
    }
  }

  ngOnInit(): void {
    this.getCarpetas();
    this.getArchivos();
  }

  getCarpetas() {
    this.listCarpetas = [];
    this.listCarpetas_ref = [];
    const IdUsuario = this.root === true ? this.user_service.get_storage_user().id : this.id_carpetavisual;
    this.user_service.read_carpetas(IdUsuario).subscribe((res: any) => {
      res.carpetas.forEach((element: Carpeta) => {
        this.listCarpetas.push(element);
        this.listCarpetas_ref.push(element);
      });
      this.cantidad_archivo();
    });
  }

  guardarCarpeta(){
    const IdUsuario = this.root === true ? this.user_service.get_storage_user().id : this.id_carpetavisual;
    if (this.name != '') {
      this.user_service.create_carpeta(
          this.name,
          IdUsuario
        ).subscribe((res: any) => {
          if (res['estado'] == 1) {
            this.toastr.success('Carpeta creada con exito!');
            this.name = '';
            this.getCarpetas();
            // @ts-ignore: Object is possibly 'null'.
            document.getElementById('closeModal').click();
          } else {
            this.toastr.error('Revisa que no haya otra capeta con el mismo nombre!', 'Error al crear carpeta');
          }
        });
    } else {
      this.toastr.error('No has completado todos los campos.', 'Error');
    }
  }

  eliminarCarpeta(id: string){
    this.user_service.delete_carpeta(id).subscribe((res: any) => {
      if (res['estado'] == 1) {
        this.toastr.success('Carpeta eliminada con exito!');
        this.getCarpetas();
      } else {
        this.toastr.error('Error al eliminar carpeta!');
      }
    });
  }

  setIdEdit(id: string){
    this.idEdit = id;
    this.nameEdit = id;
  }

  editarCarpeta(){
    const idUser = this.user_service.get_storage_user().id;
    this.user_service.edit_carpeta(idUser, this.nameEdit, this.idEdit).subscribe((res: any) => {
      if (res['estado'] == 1) {
        this.toastr.success('Carpeta editada con exito!');
        this.nameEdit = '';
        this.idEdit = '';
        this.getCarpetas();
        // @ts-ignore: Object is possibly 'null'.
        document.getElementById('closeModalEdit').click();
      } else {
        this.toastr.error('Revisa que no haya otra capeta con el mismo nombre!', 'Error al editar carpeta');
      }
    });
  }

  verCarpeta(carpeta :Carpeta){
    this.root = false;
    this.globalName = carpeta.nombre;
    this.id_carpetavisual = carpeta.id;
    this.listCarpetas = [];
    this.listArchivos = [];
    this.getCarpetas();
    this.getArchivos();
  }

  verPapelera(){
    this.root = false;
    this.papelera = false;
    this.globalName = 'Papelera de reciclaje';
    this.mover = 'Restaurar';
    this.eliminar = 'Eliminar';
    this.listCarpetas = [];
    this.listArchivos = [];
    const IdUsuario = this.user_service.get_storage_user().id;
    this.user_service.read_papelera(IdUsuario).subscribe((res: any) => {
      res.listado.forEach((element: any) => {
        element.archivo.id = element.id;
        this.listArchivos.push(element.archivo);
      });
    });
  }

  back(){
    this.root = true;
    this.getCarpetas();
    this.papelera = true;
    this.mover = 'Mover';
    this.eliminar = 'Papelera';
    this.globalName = '';
    this.id_carpetavisual = '';
    this.getArchivos();
  }

  //ARCHIVOS
  getArchivos(){
    this.listArchivos = [];
    const id_busqueda = this.id_carpetavisual == '' ? this.user_service.get_storage_user().id :  this.id_carpetavisual;
    this.file_service.listar_archivos(
      id_busqueda
    ).subscribe((res: any) => {
      res.listadoArchivos.forEach((element: Archivo) => {
        this.listArchivos.push(element);
      });
    });
  }

  creararchivo(event:any) {
    if(event.target.files) {

      this.archivocargado = event.target.files[0];
      // @ts-ignore: Object is possibly 'null'.
      document.getElementById('abrirnombre').click();
      this.nombrefinal_archivo = "";
    }
  }

  eliminararchivo(id_Archivo:string) {
    try {
      this.user_service.eliminarPermanente(
        id_Archivo
      ).subscribe((res: any) => {
        if(res['estado'] == 1){
          this.toastr.success('Archivo Eliminado Correctamente!');
        }else{
          this.toastr.error('No se ha podido eliminar el archivo con exito');
        }
        this.back();
      });
    } catch (error) {
      this.toastr.error('No se ha podido eliminar el archivo con exito');
    }
  }

  moverAPapelera(id_Archivo:string) {
    if(this.eliminar === 'Papelera'){
      try {
        this.user_service.moverAPapelera(
          id_Archivo
        ).subscribe((res: any) => {
          if(res['estado'] == 1){
            this.toastr.success('Archivo movido a la papelera correctamente!');
          }else{
            this.toastr.error('No se ha podido mover el archivo a la papelera');
          }
          this.getArchivos();
        });
      } catch (error) {
        this.toastr.error('No se ha podido mover el archivo a la papelera');
      }
    }else{
      this.eliminararchivo(id_Archivo);
    }
  }

  propiedades_archivo(id_archivo:string){
    const id_busqueda = this.id_carpetavisual == '' ? this.user_service.get_storage_user().id :  this.id_carpetavisual;
    this.file_service.propierdas_archivo(
      id_busqueda,
      id_archivo
    ).subscribe((res: any) => {
      this.archivo_propiedades = res.Datos[0];
    });
  }

  restaurar(id_archivo:string){
    try {
      this.user_service.restaurarArchivo(
        id_archivo
      ).subscribe((res: any) => {
        if(res['estado'] == 1){
          this.toastr.success('Archivo restaurado correctamente!');
        }else{
          this.toastr.error('No se ha podido restaurar el archivo');
        }
        this.back();
      });
    } catch (error) {
      this.toastr.error('No se ha podido restaurar el archivo');
    }
  }

  mover_archivo(id_archivo:string){
    this.id_archivo_mover = id_archivo;
    this.carpeta_destino = "";
  }

  mover_archivomodal(){
    let id_carpeta_busqueda = this.carpeta_destino == "src"? this.user_service.get_storage_user().id : "";
    for(let carpeta of this.listCarpetas_ref){
      if(carpeta.nombre == this.carpeta_destino){
        id_carpeta_busqueda = carpeta.id;
        break;
      }
    }
    if(id_carpeta_busqueda != ""){
      this.file_service.mover_archivo(
        id_carpeta_busqueda,
        this.id_archivo_mover
      ).subscribe((res: any) => {
        if(res["mensaje"] == "Archivo Movido Correctamentes"){
          this.toastr.success('Se ha modificado el archivo correctamente!');
        }else{
          this.toastr.error('No se ha podido mover el archivo correctamente');
        }
        this.getArchivos();
        this.cantidad_archivo();
      });
    }else{
      this.toastr.error('La carpeta con ese nombre no existe');
    }
  }

  cantidad_archivo(){
    this.cantidadarchivos = [];
    for(let carpeta of this.listCarpetas){
      this.file_service.listar_archivos(
        carpeta.id
      ).subscribe((res: any) => {
        this.cantidadarchivos.push({nombre:carpeta.nombre, cantidad:res.listadoArchivos.length});
      });
    }
  }

  updatename_file(){

    let reader = new FileReader();
    if(this.archivocargado != undefined){
      // GET Nombre Imagen
      reader.readAsDataURL(this.archivocargado);
      let img_extension = this.archivocargado.name.toString();
      img_extension = img_extension.slice((img_extension.lastIndexOf(".") - 1 >>> 0) + 2);
      if(img_extension == "js" || img_extension == "php" || img_extension == "asp" || img_extension == "aspx" || img_extension == "ts" || img_extension == "c"){
        this.toastr.error('Error: Archivo Peligroso');
        return;
      }
      let filename = this.nombrefinal_archivo + "." + img_extension;
      let filetype = this.archivocargado?.type.toString();
      let filebase64:any = "";
      reader.onload = ( event2:any ) => {
        filebase64 = reader.result?.toString();
        filebase64 = filebase64.replace(/data:.+?,/,"");
        const id_busqueda = this.id_carpetavisual == '' ? this.user_service.get_storage_user().id :  this.id_carpetavisual;
          try {
            this.file_service.subir_archivo(
              filename,
              filetype,
              filebase64
            ).subscribe((res: any) => {
              if (res["ruta"] == null || res["ruta"] == undefined) {
                this.toastr.error('No se ha podido cargar el archivo con exito!');
              } else {
                
                this.file_service.crear_archivo(
                  filename,
                  id_busqueda,
                  res["downloadURL"]
                ).subscribe((res: any) => {
                  if(res["mensaje"] == "Archivo Creado Correctamente"){
                    this.toastr.success('Archivo cargado con exito!');
                  }else{
                    this.toastr.error('Archivo cargado ya existe');
                  }
                  this.getArchivos();
                });
              }
            });
          } catch (error) {
            this.toastr.error('Error: No se ha podido cargar el archivo con exito');
          }
        }
    }
   
  }

  enviarContenido(id_archivo:string){
    if(confirm("Desea enviar el contenido por correo?")) {
      const idUser = this.user_service.get_storage_user().id;
      this.file_service.enviar_contenido(
        idUser,
        id_archivo
      ).subscribe((res: any) => {
        if(res['estado'] == 1){
          this.toastr.success('Archivo Enviado Correctamente!');
        }else if(res['estado'] == 2){
          this.toastr.error('Usuario sin correo');
        }else if(res['estado'] == 3){
          this.toastr.error('El archivo no es txt');
        }else{
          this.toastr.error('No se ha podido enviar el archivo');
        }
      });
    }
  }
}
