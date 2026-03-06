export interface ProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoriaId: number;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  categoriaId: number;
  categoriaNombre: string;
  fechaCreacion: string;
}
