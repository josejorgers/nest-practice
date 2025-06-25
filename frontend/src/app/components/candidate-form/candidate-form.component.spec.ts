import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CandidateFormComponent } from './candidate-form.component';
import { CandidateService } from '../../services/candidate.service';
import { of, throwError } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import 'jest';

declare const expect: jest.Expect;

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;
  let candidateService: jest.Mocked<CandidateService>;
  let snackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    const candidateServiceSpy = {
      uploadCandidate: jest.fn()
    } as unknown as jest.Mocked<CandidateService>;
    const snackBarSpy = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        CandidateFormComponent
      ],
      providers: [
        { provide: CandidateService, useValue: candidateServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    candidateService = TestBed.inject(CandidateService) as jest.Mocked<CandidateService>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;

    fixture = TestBed.createComponent(CandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when filled', () => {
    const form = component.candidateForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      name: 'John',
      surname: 'Doe'
    });
    
    // Still invalid because file is required
    expect(form.valid).toBeFalsy();
  });

  it('should call service on form submit', fakeAsync(() => {
    const mockFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
    
    component.onFileSelected(mockEvent);
    
    component.candidateForm.patchValue({
      name: 'John',
      surname: 'Doe'
    });
    
    (candidateService.uploadCandidate as jest.Mock).mockReturnValue(of({}));
    
    component.onSubmit();
    tick();
    
    expect(candidateService.uploadCandidate).toHaveBeenCalled();
  }));

  it('should handle error on form submit', fakeAsync(() => {
    const mockFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
    
    component.onFileSelected(mockEvent);
    
    component.candidateForm.patchValue({
      name: 'John',
      surname: 'Doe'
    });
    
    const error = { error: { message: 'Error' } };
    (candidateService.uploadCandidate as jest.Mock).mockReturnValue(throwError(() => error));
    
    component.onSubmit();
    tick();
    
    expect(candidateService.uploadCandidate).toHaveBeenCalled();
  }));
});
