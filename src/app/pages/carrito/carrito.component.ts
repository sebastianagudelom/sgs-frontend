import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { ItemCarrito } from '../../models/pedido.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  direccionEnvio = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    public carritoService: CarritoService,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  get items(): ItemCarrito[] {
    return this.carritoService.items;
  }

  actualizarCantidad(item: ItemCarrito, event: Event): void {
    const input = event.target as HTMLInputElement;
    const cantidad = parseInt(input.value, 10);
    if (isNaN(cantidad)) return;
    try {
      this.carritoService.actualizarCantidad(item.productoId, cantidad);
      this.errorMessage = '';
    } catch (e: any) {
      this.errorMessage = e.message;
      input.value = String(item.cantidad);
    }
  }

  eliminarItem(productoId: number): void {
    this.carritoService.eliminarItem(productoId);
  }

  realizarPedido(): void {
    if (this.items.length === 0) {
      this.errorMessage = 'El carrito está vacío';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.pedidoService.crearPedido({
      items: this.items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad })),
      direccionEnvio: this.direccionEnvio
    }).subscribe({
      next: () => {
        this.carritoService.vaciarCarrito();
        this.successMessage = '¡Pedido realizado exitosamente!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/mis-pedidos']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.mensaje || 'Error al realizar el pedido';
      }
    });
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }
}
