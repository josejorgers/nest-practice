import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CandidateService } from "./candidate.service";
import { Candidate } from "../models/candidate.model";
import { expect } from "@jest/globals";

describe("CandidateService", () => {
  let service: CandidateService;
  let httpMock: HttpTestingController;

  const mockCandidate: Candidate = {
    id: 1,
    name: "John",
    surname: "Doe",
    seniority: "senior",
    yearsOfExperience: 5,
    availability: true,
    createdAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CandidateService],
    });

    service = TestBed.inject(CandidateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get all candidates", () => {
    const mockCandidates: Candidate[] = [mockCandidate];

    service.getAllCandidates().subscribe((candidates) => {
      expect(candidates).toEqual(mockCandidates);
    });

    const req = httpMock.expectOne("http://localhost:3000/candidates");
    expect(req.request.method).toBe("GET");
    req.flush(mockCandidates);
  });

  it("should upload a candidate", () => {
    const formData = new FormData();
    formData.append("name", "John");
    formData.append("surname", "Doe");

    service.uploadCandidate(formData).subscribe((candidate) => {
      expect(candidate).toEqual(mockCandidate);
    });

    const req = httpMock.expectOne("http://localhost:3000/candidates/upload");
    expect(req.request.method).toBe("POST");
    req.flush(mockCandidate);
  });

  it("should handle errors", () => {
    const errorMessage = "Test error";

    service.getAllCandidates().subscribe({
      next: () => fail("should have failed with the test error"),
      error: (error) => {
        expect(error).toBeDefined();
      },
    });

    const req = httpMock.expectOne("http://localhost:3000/candidates");
    req.error(new ErrorEvent("Test error", { message: errorMessage }));
  });
});
