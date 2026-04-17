import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClienteResponse } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  listarClientes(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(`${this.apiUrl}/clientes`);
  }
}
