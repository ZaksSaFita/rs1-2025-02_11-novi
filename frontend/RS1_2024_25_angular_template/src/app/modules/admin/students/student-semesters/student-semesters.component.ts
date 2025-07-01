import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  StudentGetByIdEndpointService,
  StudentGetByIdResponse
} from '../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';
import {SemesterGetAll, SemesterGetAllResponse} from '../../../../endpoints/semester/semesterbyid';

@Component({
  selector: 'app-student-semesters',
  standalone: false,

  templateUrl: './student-semesters.component.html',
  styleUrl: './student-semesters.component.css'
})
export class StudentSemestersComponent implements OnInit {

  studentId: number = 0;
  student: StudentGetByIdResponse | null = null;
  displayedColumns: string[] = ['id', 'academicYear', 'yearOfStudy', 'renewal', 'date', 'myAppUser'];
  semesters: SemesterGetAllResponse[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private getStudentById: StudentGetByIdEndpointService,
              private getStudentSemesters: SemesterGetAll
  ) {
    this.studentId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getStudentInfo();
    this.getSemesters();
  }

  getSemesters() {
    this.getStudentSemesters.handleAsync(this.studentId).subscribe(
      data => {
        this.semesters = data;
      }
    )
  }

  getStudentInfo() {
    this.getStudentById.handleAsync(this.studentId).subscribe(
      student => {
        this.student = student;
      }
    )
  }

  newSemester() {
    this.router.navigate(['/admin/students/semestar/new/', this.studentId]);
  }
}
