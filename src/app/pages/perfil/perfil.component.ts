import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../services/perfil.service';
import { PerfilResponse, DireccionResponse, DireccionRequest } from '../../models/perfil.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  perfil: PerfilResponse | null = null;
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  // Formulario de perfil
  nombre = '';
  apellido = '';
  cedula = '';
  telefono = '';

  // Direcciones
  direcciones: DireccionResponse[] = [];
  mostrarFormDireccion = false;
  editandoDireccionId: number | null = null;
  dirNombre = '';
  dirDireccion = '';
  dirPredeterminada = false;
  savingDir = false;

  constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.loading = true;
    this.perfilService.obtenerPerfil().subscribe({
      next: (data) => {
        this.perfil = data;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.cedula = data.cedula || '';
        this.telefono = data.telefono || '';
        this.direcciones = data.direcciones || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar el perfil';
        this.loading = false;
      }
    });
  }

  guardarPerfil(): void {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.perfilService.actualizarPerfil({
      nombre: this.nombre,
      apellido: this.apellido,
      cedula: this.cedula,
      telefono: this.telefono
    }).subscribe({
      next: (data) => {
        this.perfil = data;
        this.successMessage = 'Perfil actualizado correctamente';
        this.saving = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.mensaje || err.error?.message || 'Error al actualizar el perfil';
        this.saving = false;
      }
    });
  }

  // --- Direcciones ---

  abrirFormDireccion(): void {
    this.editandoDireccionId = null;
    this.dirNombre = '';
    this.dirDireccion = '';
    this.dirPredeterminada = false;
    this.mostrarFormDireccion = true;
  }

  editarDireccion(dir: DireccionResponse): void {
    this.editandoDireccionId = dir.id;
    this.dirNombre = dir.nombre;
    this.dirDireccion = dir.direccion;
    this.dirPredeterminada = dir.predeterminada;
    this.mostrarFormDireccion = true;
  }

  cancelarFormDireccion(): void {
    this.mostrarFormDireccion = false;
    this.editandoDireccionId = null;
  }

  guardarDireccion(): void {
    this.savingDir = true;
    this.errorMessage = '';

    const request: DireccionRequest = {
      nombre: this.dirNombre,
      direccion: this.dirDireccion,
      predeterminada: this.dirPredeterminada
    };

    const obs = this.editandoDireccionId
      ? this.perfilService.actualizarDireccion(this.editandoDireccionId, request)
      : this.perfilService.crearDireccion(request);

    obs.subscribe({
      next: () => {
        this.mostrarFormDireccion = false;
        this.editandoDireccionId = null;
        this.savingDir = false;
        this.successMessage = this.editandoDireccionId ? 'Dirección actualizada' : 'Dirección agregada';
        this.cargarPerfil();
      },
      error: (err) => {
        this.errorMessage = err.error?.mensaje || err.error?.message || 'Error al guardar la dirección';
        this.savingDir = false;
      }
    });
  }

  eliminarDireccion(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

    this.perfilService.eliminarDireccion(id).subscribe({
      next: () => {
        this.successMessage = 'Dirección eliminada';
        this.cargarPerfil();
      },
      error: () => {
        this.errorMessage = 'Error al eliminar la dirección';
      }
    });
  }

  marcarPredeterminada(id: number): void {
    this.perfilService.marcarPredeterminada(id).subscribe({
      next: () => {
        this.successMessage = 'Dirección predeterminada actualizada';
        this.cargarPerfil();
      },
      error: () => {
        this.errorMessage = 'Error al actualizar la dirección predeterminada';
      }
    });
  }
}
