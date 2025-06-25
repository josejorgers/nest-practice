import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CandidateFormComponent } from './components/candidate-form/candidate-form.component';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { CandidateService } from './services/candidate.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CandidateFormComponent,
    CandidateListComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Candidate Management</span>
    </mat-toolbar>

    <main class="container">
      <mat-card class="form-card">
        <app-candidate-form (candidateAdded)="loadCandidates()"></app-candidate-form>
      </mat-card>

      <mat-card class="list-card">
        <mat-card-header>
          <mat-card-title>Candidates</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-candidate-list></app-candidate-list>
        </mat-card-content>
      </mat-card>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .container {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .form-card, .list-card {
      width: 100%;
    }

    mat-card-content {
      padding-top: 16px;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    // This will be handled by the candidate list component
  }
}
