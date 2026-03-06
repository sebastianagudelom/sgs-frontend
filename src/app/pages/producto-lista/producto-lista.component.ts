import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { ProductoResponse } from '../../models/producto.model';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-lista.component.html',
  styleUrl: './producto-lista.component.css'
})
export class ProductoListaComponent implements OnInit {
  productos: ProductoResponse[] = [];
  productosFiltrados: ProductoResponse[] = [];
  busqueda = '';
  loading = true;
  isAdmin = false;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    const obs = this.isAdmin
      ? this.productoService.listarTodos()
      : this.productoService.listarActivos();

    obs.subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  buscar(): void {
    if (this.busqueda.trim()) {
      this.productosFiltrados = this.productos.filter(p =>
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        p.categoriaNombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    } else {
      this.productosFiltrados = this.productos;
    }
  }

  agregarProducto(): void {
    this.router.navigate(['/productos/nuevo']);
  }

  editarProducto(id: number): void {
    this.router.navigate(['/productos/editar', id]);
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe({
        next: () => this.cargarProductos()
      });
    }
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }
}
