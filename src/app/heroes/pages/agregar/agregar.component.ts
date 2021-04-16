import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';

import { HeroesService } from '../../services/heroes.service';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img{
      width: 100%;
      border-radius:5px;
    }
    button{
      margin-bottom:5px
    }
  `
  ]
})
export class AgregarComponent implements OnInit {

  publishers=[
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ];

  heroe:Heroe={
    superhero:'',
    alter_ego:'',
    characters:'',
    first_appearance:'',
    publisher:Publisher.DCComics,
    alt_img:'',
  }

  constructor(private heroesService:HeroesService,
              private activatedRoute:ActivatedRoute,
              private router:Router,
              private snackBar:MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {

    if( !this.router.url.includes('editar')){
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap(({id})=> this.heroesService.getHeroePorId(id))
    )
    .subscribe((res)=>this.heroe=res);

  }

  guardar(){
    if(this.heroe.superhero.trim().length === 0 || this.heroe.alt_img.trim().length === 0 ){
      if(this.heroe.superhero.trim().length === 0){
        this.mostrarSnackbar('Debe Ingresar el nombre del Super Héroe');
      }
      else if(this.heroe.alt_img.trim().length === 0){
        this.mostrarSnackbar('Debe Ingresa la URL de la imagen');
      }


   
      return;

    }else{
      if(this.heroe.id){
        //actualizar
        this.heroesService.editarHeroe(this.heroe)
        //.subscribe(res=>this.heroe=res)
        .subscribe(res=>{
          this.mostrarSnackbar('Registro Actualizado');
        })
  
      }else{
        //Crear-agregar
        this.heroesService.agregarHeroe(this.heroe)
        .subscribe(res=>{
          this.router.navigate(['/heroes/editar',res.id]);
          this.mostrarSnackbar('Registro Creado');
        });
      }

    }

  }

  borrar(){

    const dialog=this.dialog.open(ConfirmarComponent,{
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(
      (result)=>{
        if(result){
          this.heroesService.borrarHeroe(this.heroe.id!)
          .subscribe(res =>{
            this.router.navigate(['/heroes']);
          })

        }
      }
    )


  }

  mostrarSnackbar(mensaje: string){
    this.snackBar.open(mensaje, 'Ok!', {
      duration:2500
    });
  }

}
