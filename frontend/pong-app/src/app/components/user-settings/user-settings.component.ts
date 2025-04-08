import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserSettingsComponent implements OnInit {
  userForm: FormGroup;
  currentUser: any;
  avatarPreview: string | null = null;
  selectedFile: File | null = null;
  message: string = '';
  error: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      tournament_name: ['', [Validators.required, Validators.maxLength(50)]],
      avatar: [null]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.http.get(`${environment.apiUrl}/current-user/`).subscribe({
      next: (data: any) => {
        this.currentUser = data;
        this.userForm.patchValue({
          username: data.username,
          email: data.email,
          tournament_name: data.tournament_name
        });
        if (data.avatar) {
          if (!data.avatar.startsWith('http')) {
            this.avatarPreview = `http://localhost:8000${data.avatar}`;
          } else {
            this.avatarPreview = data.avatar;
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar los datos del usuario:', error);
        this.error = 'Error al cargar los datos del usuario';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.error = 'La imagen no puede superar los 2MB';
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = new FormData();
      formData.append('username', this.userForm.get('username')?.value);
      formData.append('email', this.userForm.get('email')?.value);
      formData.append('tournament_name', this.userForm.get('tournament_name')?.value);
      
      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile);
      }

      this.http.patch(`${environment.apiUrl}/user_update/`, formData).subscribe({
        next: (response) => {
          this.message = 'Perfil actualizado exitosamente';
          this.error = '';
          this.loadUserData();
        },
        error: (error) => {
          this.error = error.error.error || 'Error al actualizar el perfil';
          this.message = '';
        }
      });
    }
  }
}