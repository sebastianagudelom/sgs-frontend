import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
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
  isLoggedIn = false;
  mensajeCarrito = '';
  cantidades: { [productoId: number]: number } = {};

  constructor(
    private productoService: ProductoService,
private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isLoggedIn = this.authService.isLoggedIn();
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

  agregarAlCarrito(producto: ProductoResponse): void {
    const cantidad = this.getCantidad(producto);
    try {
      this.carritoService.agregarItem({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
        stock: producto.stock
      }, cantidad);
      this.mensajeCarrito = `"${producto.nombre}" x${cantidad} agregado al carrito`;
      this.cantidades[producto.id] = 1;
      setTimeout(() => this.mensajeCarrito = '', 2500);
    } catch (e: any) {
      this.mensajeCarrito = e.message;
      setTimeout(() => this.mensajeCarrito = '', 3000);
    }
  }

  getCantidad(producto: ProductoResponse): number {
    return this.cantidades[producto.id] || 1;
  }

  incrementarCantidad(producto: ProductoResponse): void {
    const actual = this.getCantidad(producto);
    if (actual < producto.stock) {
      this.cantidades[producto.id] = actual + 1;
    }
  }

  decrementarCantidad(producto: ProductoResponse): void {
    const actual = this.getCantidad(producto);
    if (actual > 1) {
      this.cantidades[producto.id] = actual - 1;
    }
  }

  verDetalle(id: number): void {
    this.router.navigate(['/productos', id]);
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }
}
