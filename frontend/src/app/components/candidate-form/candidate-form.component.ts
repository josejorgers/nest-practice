import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../services/candidate.service';
import { finalize } from 'rxjs/operators';
import { Candidate } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
    CommonModule,
    MatIconModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add New Candidate</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="candidateForm" (ngSubmit)="onSubmit()" enctype="multipart/form-data">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Enter name" required>
              <mat-error *ngIf="candidateForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Surname</mat-label>
              <input matInput formControlName="surname" placeholder="Enter surname" required>
              <mat-error *ngIf="candidateForm.get('surname')?.hasError('required')">
                Surname is required
              </mat-error>
            </mat-form-field>
          </div>


          <div class="file-upload-container">
            <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none" accept=".xlsx, .xls" />
            <button type="button" mat-raised-button color="primary" (click)="fileInput.click()">
              <mat-icon>upload</mat-icon>
              {{ selectedFile ? selectedFile.name : 'Choose Excel File' }}
            </button>
            <div *ngIf="selectedFile" class="file-info">
              <mat-icon>description</mat-icon>
              <span>{{ selectedFile.name }} ({{ (selectedFile.size / 1024).toFixed(2) }} KB)</span>
            </div>
            <mat-error *ngIf="candidateForm.get('file')?.hasError('required') && candidateForm.get('file')?.touched">
              Excel file is required
            </mat-error>
          </div>

          <div class="button-container">
            <button mat-raised-button color="primary" type="submit" [disabled]="!candidateForm.valid || isSubmitting">
              <span *ngIf="!isSubmitting">Submit</span>
              <span *ngIf="isSubmitting">Submitting...</span>
            </button>
          </div>
        </form>
      </mat-card-content>
      <mat-progress-bar mode="indeterminate" *ngIf="isSubmitting"></mat-progress-bar>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      margin: 20px;
    }
    mat-card {
      max-width: 800px;
      margin: 0 auto;
    }
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .form-field {
      flex: 1;
    }
    .file-upload-container {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .file-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }
    .button-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    mat-progress-bar {
      margin-top: 20px;
    }
  `]
})
export class CandidateFormComponent {
  @Output() candidateAdded = new EventEmitter<void>();
  
  candidateForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private snackBar: MatSnackBar
  ) {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.candidateForm.patchValue({ file: file });
      this.candidateForm.get('file')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.candidateForm.invalid || !this.selectedFile) {
      return;
    }

    this.isSubmitting = true;
    
    const formData = new FormData();
    formData.append('name', this.candidateForm.get('name')?.value);
    formData.append('surname', this.candidateForm.get('surname')?.value);
    formData.append('file', this.selectedFile);

    this.candidateService.uploadCandidate(formData)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Candidate added successfully', 'Close', { duration: 3000 });
          this.candidateForm.reset();
          this.selectedFile = null;
          this.candidateAdded.emit();
        },
        error: (error) => {
          console.error('Error adding candidate:', error);
          this.snackBar.open(
            error.error?.message || 'Error adding candidate. Please try again.',
            'Close',
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
        }
      });
  }
}
