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
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss']
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
    if (this.candidateForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('name', this.candidateForm.get('name')?.value);
    formData.append('surname', this.candidateForm.get('surname')?.value);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.candidateService.uploadCandidate(formData).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.snackBar.open('Candidate added successfully!', 'Close', {
          duration: 3000
        });
        // Reset form and clear validation state
        this.candidateForm.reset();
        Object.keys(this.candidateForm.controls).forEach(key => {
          this.candidateForm.get(key)?.setErrors(null);
        });
        this.selectedFile = null;
        this.candidateAdded.emit(); // Emit the event to refresh the list
      },
      error: (error) => {
        console.error('Error creating candidate:', error);
        this.snackBar.open('Failed to add candidate. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
