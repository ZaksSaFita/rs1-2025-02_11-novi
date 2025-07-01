import {Component, OnInit} from '@angular/core';
import {
  StudentGetByIdEndpointService,
  StudentGetByIdResponse
} from '../../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';
import {SemesterGetAll, SemesterGetAllResponse} from '../../../../../endpoints/semester/semesterbyid';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MyAuthService} from '../../../../../services/auth-services/my-auth.service';
import {AcademicYears, AcademicYearsResponse} from '../../../../../endpoints/semester/academicyear';
import {SemesterAdd, SemesterAddRequest} from '../../../../../endpoints/semester/semesteradd';

@Component({
  selector: 'app-student-semesters-new',
  standalone: false,

  templateUrl: './student-semesters-new.component.html',
  styleUrl: './student-semesters-new.component.css'
})
export class StudentSemestersNewComponent implements OnInit {
  semesterForm: FormGroup;
  studentId: number = 0;
  student: StudentGetByIdResponse | null = null;
  semesters: SemesterGetAllResponse[] = [];
  myAppUserId: number = 0;
  academicYearsss: AcademicYearsResponse[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private getStudentById: StudentGetByIdEndpointService,
              private getStudentSemesters: SemesterGetAll,
              private fb: FormBuilder,
              private authService: MyAuthService,
              private godine: AcademicYears,
              private saljePodatke: SemesterAdd,
  ) {
    this.studentId = this.route.snapshot.params['id'];
    this.myAppUserId = Number(this.authService.getMyAuthInfo()?.userId);
    this.semesterForm = this.fb.group({
      date: [null, [Validators.required]],
      yearOfStudy: [null, [Validators.required, Validators.min(1), Validators.max(6)]],
      academicYearId: [null, [Validators.required]],
      price: {value: 1800, disabled: true},
      renewal: {value: false, disabled: true},

    })
  }

  ngOnInit(): void {
    this.getStudentInfo();
    this.getSemesters();
    this.getAcademicYears();


  }

  getSemesters() {
    this.getStudentSemesters.handleAsync(this.studentId).subscribe(
      data => {
        this.semesters = data;
        this.semesterForm.get('yearOfStudy')?.valueChanges.subscribe(() =>
          this.checkSemester()
        )
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

  saveSemester() {

    if (this.semesterForm.invalid) return;

    const semestarData = this.semesterForm.getRawValue();
    const semsterSlanje: SemesterAddRequest = {
      id: 0,
      date: semestarData.date,
      yearOfStudy: Number(semestarData.yearOfStudy),
      academicYearId: semestarData.academicYearId,
      price: semestarData.price,
      renewal: semestarData.renewal,
      myAppUserId: this.myAppUserId,
      studentId: Number(this.studentId)
    }
    console.log(semsterSlanje);

    this.saljePodatke.handleAsync(semsterSlanje).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/admin/students/semestar/', this.studentId]);
      }
    )
  }

  private getAcademicYears() {
    this.godine.handleAsync().subscribe(
      data => {
        this.academicYearsss = data;
      }
    )
  }

  private checkSemester() {

    const year = Number(this.semesterForm.get('yearOfStudy')?.value);
    console.log(year)
    const sameYear = this.semesters.find(s => s.yearOfStudy == year);
    console.log("sameyear", sameYear)
    if (sameYear) {
      this.semesterForm.patchValue({
        price: 400,
        renewal: true,
      })
    } else {
      this.semesterForm.patchValue({
        price: 1800,
        renewal: false,
      })
    }


  }
}
