import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { PermisoResponse, RolResponse } from '../../models/rol-permiso.models';
import { RolPermisoService } from '../../services/rol-permiso.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-roles-page',
  styleUrl: './roles.page.css',
  templateUrl: './roles.page.html',
})
export class RolesPage {
  private readonly rolPermisoService = inject(RolPermisoService);

  protected readonly roles = signal<RolResponse[]>([]);
  protected readonly permisos = signal<PermisoResponse[]>([]);
  protected readonly busqueda = signal('');
  protected readonly cargando = signal(false);
  protected readonly procesando = signal(false);
  protected readonly rolEditandoId = signal<number | null>(null);
  protected readonly mensaje = signal('');
  protected readonly error = signal('');

  protected readonly rolesFiltrados = computed(() => {
    const busqueda = this.busqueda().trim().toLowerCase();

    if (busqueda === '') {
      return this.roles();
    }

    return this.roles().filter((rol) => {
      const texto = [rol.nombre, rol.descripcion ?? ''].join(' ').toLowerCase();
      return texto.includes(busqueda);
    });
  });

  protected readonly rolForm = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    descripcion: new FormControl<string | null>(null),
  });

  protected readonly permisoForm = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    modulo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    accion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    descripcion: new FormControl<string | null>(null),
  });

  protected readonly asignacionForm = new FormGroup({
    rolId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    permisoId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  constructor() {
    this.cargarDatos();
  }

  protected actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  protected cargarDatos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.rolPermisoService
      .listarRoles()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (roles) => {
          this.roles.set(roles);
          this.cargarPermisos();
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.obtenerMensajeError(error));
          this.cargarPermisos();
        },
      });
  }

  protected seleccionarRol(rol: RolResponse): void {
    this.rolEditandoId.set(rol.id);
    this.asignacionForm.controls.rolId.setValue(rol.id);
    this.rolForm.setValue({
      nombre: rol.nombre,
      descripcion: rol.descripcion,
    });
    this.limpiarMensajes();
  }

  protected cancelarEdicionRol(): void {
    this.rolEditandoId.set(null);
    this.rolForm.reset();
  }

  protected guardarRol(): void {
    this.limpiarMensajes();

    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    this.procesando.set(true);
    const { nombre, descripcion } = this.rolForm.getRawValue();
    const request = {
      nombre: nombre.trim().toUpperCase(),
      descripcion: this.limpiarTextoOpcional(descripcion),
    };
    const rolId = this.rolEditandoId();
    const operacion =
      rolId === null
        ? this.rolPermisoService.crearRol(request)
        : this.rolPermisoService.actualizarRol(rolId, request);

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: () => {
        this.mensaje.set(
          rolId === null
            ? 'Rol creado correctamente.'
            : 'Rol actualizado correctamente.'
        );
        this.cancelarEdicionRol();
        this.cargarRoles();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  protected cambiarEstadoRol(rol: RolResponse): void {
    this.limpiarMensajes();
    this.procesando.set(true);
    const operacion = rol.activo
      ? this.rolPermisoService.desactivarRol(rol.id)
      : this.rolPermisoService.activarRol(rol.id);

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: (response) => {
        this.mensaje.set(response.mensaje);
        this.cargarRoles();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  protected crearPermiso(): void {
    this.limpiarMensajes();

    if (this.permisoForm.invalid) {
      this.permisoForm.markAllAsTouched();
      return;
    }

    this.procesando.set(true);
    const { nombre, modulo, accion, descripcion } = this.permisoForm.getRawValue();

    this.rolPermisoService
      .crearPermiso({
        nombre: nombre.trim().toUpperCase(),
        modulo: modulo.trim().toUpperCase(),
        accion: accion.trim().toUpperCase(),
        descripcion: this.limpiarTextoOpcional(descripcion),
      })
      .pipe(finalize(() => this.procesando.set(false)))
      .subscribe({
        next: () => {
          this.mensaje.set('Permiso creado correctamente.');
          this.permisoForm.reset();
          this.cargarPermisos();
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.obtenerMensajeError(error));
        },
      });
  }

  protected cambiarEstadoPermiso(permiso: PermisoResponse): void {
    this.limpiarMensajes();
    this.procesando.set(true);
    const operacion = permiso.activo
      ? this.rolPermisoService.desactivarPermiso(permiso.id)
      : this.rolPermisoService.activarPermiso(permiso.id);

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: (response) => {
        this.mensaje.set(response.mensaje);
        this.cargarPermisos();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  protected asignarPermiso(): void {
    this.ejecutarAccionPermisoRol('asignar');
  }

  protected activarPermisoRol(): void {
    this.ejecutarAccionPermisoRol('activar');
  }

  protected desactivarPermisoRol(): void {
    this.ejecutarAccionPermisoRol('desactivar');
  }

  private ejecutarAccionPermisoRol(
    accion: 'asignar' | 'activar' | 'desactivar'
  ): void {
    this.limpiarMensajes();

    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      return;
    }

    const { rolId, permisoId } = this.asignacionForm.getRawValue();

    if (rolId === null || permisoId === null) {
      this.error.set('Debes indicar rol y permiso.');
      return;
    }

    this.procesando.set(true);
    const operacion =
      accion === 'asignar'
        ? this.rolPermisoService.asignarPermiso(rolId, permisoId)
        : accion === 'activar'
          ? this.rolPermisoService.activarPermisoRol(rolId, permisoId)
          : this.rolPermisoService.desactivarPermisoRol(rolId, permisoId);

    operacion.pipe(finalize(() => this.procesando.set(false))).subscribe({
      next: (response) => {
        this.mensaje.set(response.mensaje);
        this.cargarRoles();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  private cargarRoles(): void {
    this.rolPermisoService.listarRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  private cargarPermisos(): void {
    this.rolPermisoService.listarPermisos().subscribe({
      next: (permisos) => {
        this.permisos.set(permisos);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.obtenerMensajeError(error));
      },
    });
  }

  private limpiarMensajes(): void {
    this.mensaje.set('');
    this.error.set('');
  }

  private limpiarTextoOpcional(valor: string | null): string | null {
    if (valor === null) {
      return null;
    }

    const limpio = valor.trim();
    return limpio === '' ? null : limpio;
  }

  private obtenerMensajeError(error: HttpErrorResponse): string {
    const detail = this.obtenerDetail(error.error);

    if (detail !== '') {
      return detail;
    }

    return 'No se pudo completar la operación. Intenta nuevamente.';
  }

  private obtenerDetail(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'detail' in error &&
      typeof error.detail === 'string'
    ) {
      return error.detail;
    }

    return '';
  }
}
