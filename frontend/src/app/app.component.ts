import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CandidateFormComponent } from "./components/candidate-form/candidate-form.component";
import { CandidateListComponent } from "./components/candidate-list/candidate-list.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CandidateFormComponent,
    CandidateListComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @ViewChild(CandidateListComponent) candidateList!: CandidateListComponent;

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // Empty
  }

  onCandidateAdded(): void {
    if (this.candidateList) {
      this.candidateList.loadCandidates();
    }
  }
}
