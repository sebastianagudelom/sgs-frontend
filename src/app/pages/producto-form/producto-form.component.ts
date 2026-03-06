import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaResponse } from '../../models/categoria.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  categorias: CategoriaResponse[] = [];
  editando = false;
  productoId: number | null = null;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      precio: [null, [Validators.required, Validators.min(1)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      imagenUrl: [''],
      categoriaId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editando = true;
      this.productoId = +id;
      this.cargarProducto(this.productoId);
    }
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => this.categorias = data
    });
  }

  cargarProducto(id: number): void {
    this.productoService.obtenerPorId(id).subscribe({
      next: (producto) => {
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          imagenUrl: producto.imagenUrl,
          categoriaId: producto.categoriaId
        });
      },
      error: () => {
        this.router.navigate(['/productos']);
      }
    });
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.productoForm.value;

    const obs = this.editando && this.productoId
      ? this.productoService.actualizar(this.productoId, formValue)
      : this.productoService.crear(formValue);

    obs.subscribe({
      next: () => {
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.mensaje || 'Error al guardar el producto';
      }
    });
  }

  get f() {
    return this.productoForm.controls;
  }
}
