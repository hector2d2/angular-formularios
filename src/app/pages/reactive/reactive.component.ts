import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css'],
})
export class ReactiveComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validadores: ValidadoresService
  ) {
    this.crearFormulario();
    this.cargarDatosFormulario();
  }

  ngOnInit(): void {}

  get pasatiempos() {
    return this.form.get('pasatiempos') as FormArray;
  }

  get nombreNoValido() {
    return this.form.get('nombre').invalid && this.form.get('nombre').touched;
  }

  get apellidoNoValido() {
    return (
      this.form.get('apellido').invalid && this.form.get('apellido').touched
    );
  }

  get correoNoValido() {
    return this.form.get('correo').invalid && this.form.get('correo').touched;
  }

  get usuarioNoValido() {
    return this.form.get('usuario').invalid && this.form.get('usuario').touched;
  }

  get distritoNoValido() {
    return (
      this.form.get('direccion.distrito').invalid &&
      this.form.get('direccion.distrito').touched
    );
  }

  get ciudadNoValido() {
    return (
      this.form.get('direccion.ciudad').invalid &&
      this.form.get('direccion.ciudad').touched
    );
  }

  get passNoValido() {
    return this.form.get('pass1').invalid && this.form.get('pass1').touched;
  }

  get pass2NoValido() {
    const pass1 = this.form.get('pass1').value;
    const pass2 = this.form.get('pass2').value;
    return pass1 !== pass2;
  }

  crearFormulario() {
    this.form = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(5)]],
        apellido: ['', [Validators.required, this.validadores.noTristan]],
        correo: [
          '',
          [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          ],
        ],
        usuario: ['', Validators.required, this.validadores.existeUsuario],
        pass1: ['', Validators.required],
        pass2: ['', Validators.required],
        direccion: this.fb.group({
          distrito: ['', Validators.required],
          ciudad: ['', Validators.required],
        }),
        pasatiempos: this.fb.array([]),
      },
      {
        Validators: this.validadores.passwordsIguales('pass1', 'pass2'),
      }
    );
  }

  cargarDatosFormulario() {
    // this.form.setValue({
    //   nombre: 'Hector',
    //   apellido: 'Tristan',
    //   correo: 'hector@hotmail.com',
    //   direccion: {
    //     distrito: 'Ontario',
    //     ciudad: 'Ottawa',
    //   },
    // });
    this.form.reset({
      nombre: 'Hector',
      apellido: 'Tristan',
      correo: 'hector@hotmail.com',
      pass1:123,
      pass2:123,
      direccion: {
        distrito: 'Ontario',
        ciudad: 'Ottawa',
      },
    });
  }

  agregarPasatiempo() {
    this.pasatiempos.push(this.fb.control(''));
  }

  borrarPasatiempo(i: number) {
    this.pasatiempos.removeAt(i);
  }

  guardar() {
    console.log(this.form);
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((control) => {
        control instanceof FormGroup
          ? Object.values(control.controls).forEach((control) =>
              control.markAsTouched()
            )
          : control.markAsTouched();
      });
    }

    // Posteo de informacion
    // this.form.reset();
    this.form.reset({
      nombre: '',
    });
  }
}
