import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CandidateService } from '../../services/candidate.service';
import { Candidate } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="table-container">
      <div class="loading-shade" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
      </div>

      <table mat-table [dataSource]="candidates" class="mat-elevation-z1">
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let candidate">{{candidate.name}}</td>
        </ng-container>

        <!-- Surname Column -->
        <ng-container matColumnDef="surname">
          <th mat-header-cell *matHeaderCellDef>Surname</th>
          <td mat-cell *matCellDef="let candidate">{{candidate.surname}}</td>
        </ng-container>

        <!-- Seniority Column -->
        <ng-container matColumnDef="seniority">
          <th mat-header-cell *matHeaderCellDef>Seniority</th>
          <td mat-cell *matCellDef="let candidate">
            <span class="badge" [ngClass]="candidate.seniority">
              {{candidate.seniority | titlecase}}
            </span>
          </td>
        </ng-container>


        <!-- Years of Experience Column -->
        <ng-container matColumnDef="yearsOfExperience">
          <th mat-header-cell *matHeaderCellDef>Years of Experience</th>
          <td mat-cell *matCellDef="let candidate">{{candidate.yearsOfExperience}}</td>
        </ng-container>

        <!-- Availability Column -->
        <ng-container matColumnDef="availability">
          <th mat-header-cell *matHeaderCellDef>Available</th>
          <td mat-cell *matCellDef="let candidate">
            <mat-icon [ngClass]="{'available': candidate.availability, 'unavailable': !candidate.availability}">
              {{candidate.availability ? 'check_circle' : 'cancel'}}
            </mat-icon>
          </td>
        </ng-container>

        <!-- Header and Row Definitions -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div class="no-data" *ngIf="candidates.length === 0 && !isLoading">
        <mat-icon>info</mat-icon>
        <p>No candidates found. Add your first candidate using the form above.</p>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      position: relative;
      min-height: 200px;
    }

    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.7);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }


    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .junior {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .senior {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .available {
      color: #2e7d32;
    }


    .unavailable {
      color: #c62828;
    }

    .no-data {
      padding: 24px;
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class CandidateListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'surname', 'seniority', 'yearsOfExperience', 'availability'];
  candidates: Candidate[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    this.error = null;
    
    this.candidateService.getAllCandidates()?.subscribe({
      next: (candidates) => {
        this.candidates = candidates;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.error = 'Failed to load candidates. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
