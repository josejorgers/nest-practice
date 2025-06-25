import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CandidateListComponent } from './candidate-list.component';
import { CandidateService } from '../../services/candidate.service';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Candidate } from '../../models/candidate.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import 'jest';

declare const expect: jest.Expect;

describe('CandidateListComponent', () => {
  let component: CandidateListComponent;
  let fixture: ComponentFixture<CandidateListComponent>;
  let candidateService: jest.Mocked<CandidateService>;

  const mockCandidates: Candidate[] = [
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      yearsOfExperience: 5,
      availability: true,
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Jane',
      surname: 'Smith',
      seniority: 'junior',
      yearsOfExperience: 2,
      availability: false,
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    const candidateServiceSpy = {
      getAllCandidates: jest.fn()
    } as unknown as jest.Mocked<CandidateService>;

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule,
        NoopAnimationsModule,
        CandidateListComponent
      ],
      providers: [
        { provide: CandidateService, useValue: candidateServiceSpy }
      ]
    }).compileComponents();

    candidateService = TestBed.inject(CandidateService) as jest.Mocked<CandidateService>;
    fixture = TestBed.createComponent(CandidateListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load candidates on init', fakeAsync(() => {
    (candidateService.getAllCandidates as jest.Mock).mockReturnValue(of(mockCandidates));
    
    fixture.detectChanges(); // ngOnInit()
    tick(); // Wait for async operations to complete
    
    expect(candidateService.getAllCandidates).toHaveBeenCalled();
    expect(component.candidates.length).toBe(2);
    expect(component.isLoading).toBeFalsy();
    
    const tableRows = fixture.nativeElement.querySelectorAll('tr');
    // Header row + 2 data rows
    expect(tableRows.length).toBe(3);
  }));

  it('should handle error when loading candidates', fakeAsync(() => {
    const error = 'Test error';
    (candidateService.getAllCandidates as jest.Mock).mockReturnValue(throwError(() => error));
    
    fixture.detectChanges(); // ngOnInit()
    tick(); // Wait for async operations to complete
    
    expect(candidateService.getAllCandidates).toHaveBeenCalled();
    expect(component.error).toBe('Failed to load candidates. Please try again later.');
    expect(component.isLoading).toBeFalsy();
  }));

});
